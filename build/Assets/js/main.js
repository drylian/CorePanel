class CookieManager {
    static set(name, value, daysToExpire = 7) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + daysToExpire);

        const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
        document.cookie = cookieString;
    }
    static get(name) {
        const cookieString = document.cookie;
        const cookies = cookieString.split(';');

        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');

            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }

        return null;
    }
    static del(name) {
        const cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = cookieString;
    }
}