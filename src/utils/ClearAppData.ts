export const clearToken = () => {
    localStorage.removeItem("token");
}

export const clearAppData = () => {
    clearToken();
}