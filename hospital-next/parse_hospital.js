const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function parseHtml(html, baseUrl) {
    const internalLinks = new Set();
    const headings = [];
    const images = [];
    let title = '';

    // Very basic regex-based extraction (sufficient for link discovery)
    
    // Title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) title = titleMatch[1].trim();

    // Links
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        try {
            const url = new URL(match[1], baseUrl);
            if (url.hostname === new URL(baseUrl).hostname) {
                const cleanUrl = url.origin + url.pathname.replace(/\/$/, '');
                if (cleanUrl) internalLinks.add(cleanUrl);
            }
        } catch (e) {}
    }

    // Headings
    const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gis;
    while ((match = headingRegex.exec(html)) !== null) {
        headings.push({ level: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() });
    }

    // Images
    const imgRegex = /<img\s+(?:[^>]*?\s+)?src=["']([^"']+)["'](?:[^>]*?\s+)?alt=["']([^"']*)["']/gi;
    while ((match = imgRegex.exec(html)) !== null) {
        images.push({ src: new URL(match[1], baseUrl).href, alt: match[2] });
    }

    return {
        url: baseUrl,
        title,
        headings,
        links: Array.from(internalLinks).sort(),
        images,
        textSample: html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim().substring(0, 1000) + "..."
    };
}

const htmlPath = 'd:\\web\\hospital-next\\homepage.html';
const baseUrl = 'https://balajihospitaljaipur.com';

if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const result = parseHtml(html, baseUrl);
    fs.writeFileSync('d:\\web\\hospital-next\\discovered_links.json', JSON.stringify(result, null, 2), 'utf8');
    console.log("Successfully wrote results to discovered_links.json");
} else {
    console.error("File not found:", htmlPath);
}
