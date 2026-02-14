export const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url) return false;
    try {
        new URL(url);
        return url.startsWith('http');
    } catch {
        return false;
    }
};