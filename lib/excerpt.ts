export function excerptFromHtml(html: string, maxSentences = 2) {
  if (!html) return "";

  // Remove HTML tags
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";

  // Split into sentences (simple heuristic)
  const parts = text.match(/[^.?!]+[.?!]?/g) || [text];
  const selected = parts.slice(0, maxSentences).join(" ").trim();

  // Ensure fallback length
  if (selected.length === 0) return text.slice(0, 160);
  return selected;
}

export default excerptFromHtml;

/**
 * Extract the first image URL from HTML or Markdown content.
 * Returns the src string or null when not found.
 */
export function extractFirstImageSrc(html: string): string | null {
  if (!html) return null;

  // Try HTML <img src="..."> (handles single or double quotes)
  const imgMatch = html.match(/<img[^>]*\s+src\s*=\s*["']([^"']+)["'][^>]*>/i);
  if (imgMatch && imgMatch[1]) return imgMatch[1];

  // Try Markdown image syntax ![alt](url)
  const mdMatch = html.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (mdMatch && mdMatch[1]) return mdMatch[1];

  return null;
}

/**
 * Remove the first <img ...> tag or first Markdown image from given HTML/Markdown string.
 * Returns cleaned HTML string.
 */
export function removeFirstImageTag(html: string): string {
  if (!html) return html;

  // Remove first HTML <img ...> occurrence
  const imgHtmlRegex = /<img[^>]*\s+src\s*=\s*["'][^"']+["'][^>]*>/i;
  if (imgHtmlRegex.test(html)) {
    return html.replace(imgHtmlRegex, "");
  }

  // Otherwise remove first Markdown image ![alt](url)
  const mdImgRegex = /!\[[^\]]*\]\(([^)]+)\)/;
  if (mdImgRegex.test(html)) {
    return html.replace(mdImgRegex, "");
  }

  return html;
}
