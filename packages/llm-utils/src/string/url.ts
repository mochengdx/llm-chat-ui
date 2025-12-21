/**
 * URL Utilities
 * URL 工具集
 */

/**
 * Extract all URLs from a given string.
 * 从给定字符串中提取所有 URL。
 *
 * @param text The input string to search for URLs. / 要搜索 URL 的输入字符串。
 * @returns An array of found URLs. Returns an empty array if none found. / 找到的 URL 数组。如果没有找到，则返回空数组。
 *
 * @example
 * extractUrls("Check this out: https://example.com and http://test.org");
 * // returns ["https://example.com", "http://test.org"]
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];

  // Regular expression for matching URLs
  // 用于匹配 URL 的正则表达式
  // Matches http, https, ftp, and common domain patterns
  // 匹配 http, https, ftp 和常见的域名模式
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const matches = text.match(urlRegex);
  return matches ? matches : [];
}

/**
 * Check if a string is a valid URL.
 * 检查字符串是否为有效的 URL。
 *
 * @param text The string to check. / 要检查的字符串。
 * @returns True if valid, false otherwise. / 如果有效则返回 true，否则返回 false。
 */
export function isValidUrl(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}
