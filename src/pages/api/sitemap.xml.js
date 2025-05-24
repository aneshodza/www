export default async function handler(req, res) {
  const baseUrl =  "https://aneshodza.ch"

  let commit = await fetch('https://api.github.com/repos/aneshodza/www/commits?sha=main')
  commit = await commit.json()

  const routes = [
    { url: '/', changefreq: 'daily', priority: 1 },
    { url: '/projects', changefreq: 'daily', priority: 0.5 },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes.map(({ url, changefreq, priority }) => {
        return `
          <url>
            <loc>${baseUrl}${url}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
            <lastmod>${commit[0].commit.author.date}</lastmod>
          </url>
        `;
      })
      .join('')}
    </urlset>`;

  // Set the content type to XML
  res.setHeader('Content-Type', 'text/xml');

  // Send the XML sitemap
  res.write(sitemap);
  res.end();
}
