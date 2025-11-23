/**
 * Retrieves a cookie value by name.
 * @param name The name of the cookie to retrieve.
 * @returns The cookie value if found, otherwise null.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Sets a cookie with a specified name, value, and expiration in days.
 * Configures the cookie with Path=/, SameSite=Strict, and Secure (if HTTPS).
 * @param name The name of the cookie.
 * @param value The value to store in the cookie.
 * @param days The number of days until the cookie expires.
 */
export function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  const secureFlag = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Strict' + secureFlag;
}

/**
 * Deletes a cookie by setting its expiration date to the past.
 * @param name The name of the cookie to delete.
 */
export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
