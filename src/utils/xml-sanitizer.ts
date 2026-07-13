/**
 * Escapes special XML characters to prevent rendering injections inside SVG tags.
 * 
 * @param str Raw input string.
 * @returns Escaped safe XML string.
 */
export function escapeXml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, (tag) => {
    const chars: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&apos;',
      '"': '&quot;'
    };
    return chars[tag] || tag;
  });
}
