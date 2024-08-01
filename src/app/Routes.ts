import { profile } from "console";

export const routes = {
    home: "/",
    reels: "/reels",
    following: "/following",
    profile: "/profile/:userId",
    searchPage: "/search/:entity",
    chat: "/chat/:userId",
    chatWithoutUserId: "/chat",
    login: "/login",
    register: "/register",
    notFound: "/404"
};