export type FirebaseNotificationRequest = {
    title?: string;
    body?: string;
    topic?: string;
    token: string;
    redirect_url?: string;
    image?: string;
}

export type FirebaseSaveTokenRequest = {
    user_id: number;
    token: string;
}