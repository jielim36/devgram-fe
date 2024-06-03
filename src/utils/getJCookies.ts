const cookieKey = {
    jSessionId: "JSESSIONID",
};

const getCookieByName = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
};

export const getJSessionIdCookies = (): string | null => {
    return getCookieByName(cookieKey.jSessionId);
};