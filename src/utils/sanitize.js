// XSS Sanitization & Input Guard Utilities

/**
 * Escapes unsafe HTML characters to prevent XSS injection in raw HTML rendering (document.write, innerHTML)
 * @param {string|any} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  if (typeof str !== 'string') str = String(str);
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips dangerous HTML tags and scripts from user inputs
 * @param {string} input 
 * @returns {string}
 */
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Basic content moderation word filter for student safety
 * @param {string} text 
 * @returns {{ isSafe: boolean, cleanText: string }}
 */
export function filterContent(text) {
  if (!text || typeof text !== 'string') return { isSafe: true, cleanText: '' };
  
  const blockedWords = ['abuse', 'cheat', 'hack', 'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'kill'];
  let clean = text;
  let hasBlocked = false;

  blockedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(clean)) {
      hasBlocked = true;
      clean = clean.replace(regex, '***');
    }
  });

  return {
    isSafe: !hasBlocked,
    cleanText: clean
  };
}
