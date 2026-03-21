import os
import re
import json
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

class HospitalParser(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.links = set()
        self.headings = []
        self.images = []
        self.text = []
        self.metadata = {}
        self.current_tag = None

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attr_dict = dict(attrs)
        
        if tag == 'a' and 'href' in attr_dict:
            url = attr_dict['href']
            full_url = urljoin(self.base_url, url)
            if urlparse(full_url).netloc == urlparse(self.base_url).netloc:
                # Normalize URL
                u = full_url.split('#')[0].rstrip('/')
                if u: self.links.add(u)
        
        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.headings.append({'level': tag, 'text': ''})
            
        if tag == 'img' and 'src' in attr_dict:
            self.images.append({'src': urljoin(self.base_url, attr_dict['src']), 'alt': attr_dict.get('alt', '')})
            
        if tag == 'meta':
            name = attr_dict.get('name') or attr_dict.get('property')
            content = attr_dict.get('content')
            if name and content:
                self.metadata[name] = content

    def handle_data(self, data):
        data = data.strip()
        if not data:
            return
            
        if self.current_tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            if self.headings:
                self.headings[-1]['text'] += data + " "
        elif self.current_tag not in ['script', 'style']:
            self.text.append(data)

    def handle_endtag(self, tag):
        self.current_tag = None

def parse_file(filepath, base_url):
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
    except Exception as e:
        return {"error": str(e)}
    
    parser = HospitalParser(base_url)
    parser.feed(html)
    
    return {
        'url': base_url,
        'metadata': parser.metadata,
        'headings': [h for h in parser.headings if h['text'].strip()],
        'links': sorted(list(parser.links)),
        'images': parser.images,
        'text_sample': ' '.join(parser.text)[:1000] + "..."
    }

if __name__ == "__main__":
    import sys
    html_path = r'd:\web\hospital-next\homepage.html'
    result = parse_file(html_path, 'https://balajihospitaljaipur.com')
    print(json.dumps(result, indent=2))
