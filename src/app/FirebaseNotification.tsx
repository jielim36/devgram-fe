import { MessagePayload, NotificationPayload, onMessage } from "firebase/messaging";
import React, { useEffect, useState } from "react";
import "./App.css";
import { getFirebaseToken, messaging } from "@/FirebaseConfig";
import logo from "@/assets/devgram-icon.svg";
import toast from "react-hot-toast";
import AvatarContainer from "@/components/AvatarContainer/AvatarContainer";
import { useSaveFirebaseToken, useSendMessageNotification } from "@/hooks";
import { FirebaseNotificationRequest, FirebaseSaveTokenRequest, User } from "@/types";
import { useAuth } from "@/utils/AuthProvider";
import { XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "react-responsive";

interface NotificationPayloadProps {
    data?: MessagePayload | undefined;
    open: boolean;
}

type MessageProps = {
    notification?: NotificationPayload;
    onClose?: () => void;
};

const Message: React.FC<MessageProps> = ({
    notification,
    onClose,
}) => {
    if (!notification) return null;

    return (
        <>
            <div className="relative flex flex-row gap-2 overflow-hidden w-[300px]">
                {notification.image && (
                    <AvatarContainer
                        userId={-1}
                        disableClickEvent avatar_url={notification.image} hasStory={false} avatarClassName="card-color" />
                )}
                <div className="flex flex-col overflow-hidden">
                    <p className="font-bold truncate break-all">{notification.title}</p>
                    <p className="text-xs truncate break-all">{notification.body}</p>
                </div>

                <div className="cursor-pointer h-fit w-fit" onClick={onClose}>
                    <XIcon width={16} height={16} />
                </div>
            </div>
        </>
    );
};

function FirebaseNotification() {

    const { user } = useAuth();
    const isMediumScreen = useMediaQuery({ minWidth: 768 });

    const saveTokenMutation = useSaveFirebaseToken({
        onSuccess: () => { }
    });

    // This is self invoking function that listen of the notification
    const onMessageListener = (async () => {
        if (!user) return;

        const messagingResolve = await messaging;
        if (messagingResolve) {
            onMessage(messagingResolve, (payload: MessagePayload) => {
                console.log("RECEIVED");

                if (!payload?.notification) return;
                console.log("Notification received. ", payload.notification);

                toast((t) => <Message notification={payload?.notification} onClose={() => toast.dismiss(t.id)} />, {
                    position: isMediumScreen ? "bottom-right" : "top-center"
                });
            });
        }
    })();

    const handleGetFirebaseToken = (user: User) => {
        getFirebaseToken().then((firebaseToken: string | undefined) => {
            if (firebaseToken) {
                const message: FirebaseNotificationRequest = {
                    token: firebaseToken,
                    title: "Hello",
                    body: "This is a test notification",
                };
                const tokenForm: FirebaseSaveTokenRequest = {
                    user_id: user.id,
                    token: firebaseToken,
                };

                // sendNotificationMutation.mutate(message);
                saveTokenMutation.mutate(tokenForm);
            }
        });
    };

    // Need this handle FCM token generation when a user manually blocks or allows notification
    useEffect(() => {
        console.log("Notification Permission:", window.Notification?.permission);

        if (
            "Notification" in window &&
            window.Notification?.permission === "granted"
            && user && user.id
        ) {
            handleGetFirebaseToken(user);
        }

        // const notification: NotificationPayload = {
        //     title: "Hello xxxxxxxxxxxxxxxxxxxxxxdddddddddddddddddddddddddddddddddddddddddddddddddd",
        //     body: "This is a test notification xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxdddddddddddddddddddddddddddddddddddddddddddddddddd",
        //     image: logo,
        // }

        // toast((t) => <Message notification={notification} onClose={() => toast.dismiss(t.id)} />);
    }, [user]);

    return (
        <></>
    );
}

export default FirebaseNotification;