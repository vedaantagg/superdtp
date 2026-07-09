<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>SuperDTP — XML Sitemap</title>
<link rel="icon" type="image/png" href="/static/favicon.png"/>
<style>
  :root { --bg:#09090b; --panel:#111114; --border:rgba(255,255,255,0.1); --gold:#d4af37; --text:#fafafa; --muted:rgba(255,255,255,0.55); }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    padding: 48px 24px 80px;
  }
  .wrap { max-width: 920px; margin: 0 auto; }
  header { margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
  .eyebrow { font-family: 'Courier New', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin: 0 0 10px; }
  h1 { font-size: clamp(1.6rem, 4vw, 2.4rem); margin: 0 0 10px; font-weight: 600; letter-spacing: -0.01em; }
  .sub { color: var(--muted); font-size: 0.95rem; margin: 0; }
  .count { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; font-family: 'Courier New', monospace; font-size: 0.75rem; letter-spacing: 0.08em; color: var(--gold); border: 1px solid rgba(212,175,55,0.3); background: rgba(212,175,55,0.06); padding: 6px 14px; border-radius: 999px; }
  table { width: 100%; border-collapse: collapse; background: var(--panel); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  thead th { text-align: left; font-family: 'Courier New', monospace; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); padding: 14px 18px; border-bottom: 1px solid var(--border); }
  tbody td { padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.92rem; vertical-align: middle; }
  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: rgba(212,175,55,0.05); }
  a.loc { color: var(--text); text-decoration: none; font-weight: 500; }
  a.loc:hover { color: var(--gold); text-decoration: underline; }
  .meta { color: var(--muted); font-family: 'Courier New', monospace; font-size: 0.78rem; white-space: nowrap; }
  .priority { display: inline-block; min-width: 42px; text-align: center; font-family: 'Courier New', monospace; font-size: 0.78rem; color: var(--gold); }
  footer { margin-top: 32px; text-align: center; color: var(--muted); font-size: 0.8rem; }
  footer a { color: var(--gold); text-decoration: none; }
  @media (max-width: 640px) {
    thead th:nth-child(3), tbody td:nth-child(3) { display: none; }
    table, thead, tbody, tr, td { display: block; }
    thead { display: none; }
    tbody tr { border-bottom: 1px solid var(--border); padding: 14px 0; }
    tbody td { border-bottom: none; padding: 4px 18px; }
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <p class="eyebrow">SuperDTP // XML Sitemap</p>
    <h1>Sitemap</h1>
    <p class="sub">Machine-readable index of all indexable pages on superdtp.com, consumed by search engine crawlers.</p>
    <span class="count"><xsl:value-of select="count(sm:urlset/sm:url)"/> URLs indexed</span>
  </header>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Last Modified</th>
        <th>Change Frequency</th>
        <th>Priority</th>
      </tr>
    </thead>
    <tbody>
      <xsl:for-each select="sm:urlset/sm:url">
        <tr>
          <td><a class="loc" href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
          <td class="meta"><xsl:value-of select="sm:lastmod"/></td>
          <td class="meta"><xsl:value-of select="sm:changefreq"/></td>
          <td><span class="priority"><xsl:value-of select="sm:priority"/></span></td>
        </tr>
      </xsl:for-each>
    </tbody>
  </table>
  <footer>
    Generated for <a href="https://www.superdtp.com/">superdtp.com</a> — see also <a href="/robots.txt">robots.txt</a> and <a href="/llms.txt">llms.txt</a>
  </footer>
</div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
