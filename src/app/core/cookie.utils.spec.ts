import { getCookie, setCookie, deleteCookie } from './cookie.utils';

describe('Cookie Utils', () => {
  beforeEach(() => {
    // Clear cookies before each test
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  it('should set and get a cookie', () => {
    const name = 'testCookie';
    const value = 'testValue';
    setCookie(name, value, 1);

    const retrievedValue = getCookie(name);
    expect(retrievedValue).toBe(value);
  });

  it('should return null for non-existent cookie', () => {
    const retrievedValue = getCookie('nonExistent');
    expect(retrievedValue).toBeNull();
  });

  it('should delete a cookie', () => {
    const name = 'cookieToDelete';
    const value = 'value';
    setCookie(name, value, 1);
    expect(getCookie(name)).toBe(value);

    deleteCookie(name);
    expect(getCookie(name)).toBeNull();
  });
});
