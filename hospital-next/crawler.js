const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { URL } = require('url');

const BASE_URL = 'https://balajihospitaljaipur.com';
const DATA_DIR = path.join('d:', 'web', 'hospital-next', 'crawl_data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const visited = new Set();
const queue = [BASE_URL];
const results = [];

function fetchPage(url) {
    console.log(`Fetching: ${url}`);
    const tempFile = path.join(DATA_DIR, 'temp.html');
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    try {
        execSync(`curl.exe -f -A "${ua}" -L "${url}" -o "${tempFile}" --stderr -`, { stdio: 'ignore' });
        return fs.readFileSync(tempFile, 'utf8');
    } catch (e) {
        console.error(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

function parseHtml(html, url) {
    const internalLinks = new Set();
    const headings = [];
    const images = [];
    let title = '';

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        try {
            const absoluteUrl = new URL(match[1], url);
            if (absoluteUrl.hostname === new URL(BASE_URL).hostname) {
                const cleanUrl = absoluteUrl.origin + absoluteUrl.pathname.replace(/\/$/, '');
                if (cleanUrl) internalLinks.add(cleanUrl);
            }
        } catch (e) {}
    }

    const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
    while ((match = headingRegex.exec(html)) !== null) {
        headings.push({ level: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() });
    }

    const imgRegex = /<img\s+(?:[^>]*?\s+)?src=["']([^"']+)["']/gi;
    const imgAltRegex = /alt=["']([^"']*)["']/i;
    while ((match = imgRegex.exec(html)) !== null) {
        const altMatch = match[0].match(imgAltRegex);
        images.push({ 
            src: new URL(match[1], url).href, 
            alt: altMatch ? altMatch[1] : '' 
        });
    }

    const metadata = {};
    const metaRegex = /<meta\s+(?:name|property)=["']([^"']+)["']\s+content=["']([^"']+)["']/gi;
    while ((match = metaRegex.exec(html)) !== null) {
        metadata[match[1]] = match[2];
    }

    return {
        url,
        title,
        metadata,
        headings,
        links: Array.from(internalLinks),
        images,
        text: html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<[^>]+>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim()
    };
}

async function startCrawl() {
    while (queue.length > 0) {
        const url = queue.shift();
        if (visited.has(url)) continue;
        visited.add(url);

        const html = fetchPage(url);
        if (!html) continue;

        const data = parseHtml(html, url);
        results.push(data);

        // Save individual page data
        const filename = url.replace(/https?:\/\//, '').replace(/[\/\\?%*:|"<>]/g, '_') + '.json';
        fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));

        // Add new links to queue
        data.links.forEach(link => {
            if (!visited.has(link) && !queue.includes(link)) {
                queue.push(link);
            }
        });

        // Small delay to be polite
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Save final combined results
    fs.writeFileSync('d:\\web\\hospital-next\\full_site_crawl.json', JSON.stringify(results, null, 2));
    console.log(`Crawl finished. Processed ${results.length} pages.`);
}

startCrawl();
