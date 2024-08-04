export const clearToken = () => {
    localStorage.removeItem("token");
}

export const clearOAuthCookie = () => {
    console.log(document.cookie);

}

export const clearAppData = () => {
    clearToken();
    // output cookies
    console.log(document.cookie);

}