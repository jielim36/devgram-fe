import PusherServer from "pusher";
import PusherClient from "pusher-js";

const PUSHER_APP_ID = import.meta.env.VITE_PUSHER_APP_ID;
const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_SECRET = import.meta.env.VITE_PUSHER_SECRET;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;

export const pusherServer = new PusherServer({
    appId: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true
});

export const pusherClient = new PusherClient(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
});

export const pusherChattingClient = new PusherClient(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
});