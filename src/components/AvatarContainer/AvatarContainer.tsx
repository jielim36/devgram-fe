import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "@/style/color.css"
import Icon from "../Icon/Icon";
import { UserInfoCard } from "./UserInfoCard";

type AvatarContainerProps = {
    userId?: number;
    avatar_url?: string;
    hasStory: boolean;
    className?: string;
    avatarClassName?: string;
    boldBorder?: boolean;
    fallbackStrokeWidth?: number;
    fallbackClassName?: string;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({
    avatar_url,
    hasStory,
    className,
    avatarClassName,
    boldBorder = false,
    userId,
    fallbackStrokeWidth = 2,
    fallbackClassName
}) => {

    const padding = boldBorder ? "p-[4px]" : "p-[2px]";
    const childPadding = boldBorder ? "p-[2px]" : "p-[1px]";
    const userProfilePath = `/profile/${userId}`;

    const handleAvatarClick = () => {
        if (hasStory) {
            // pop up story
        } else if (userId) {
            window.location.href = userProfilePath;
        }
    }

    const userAvatarContainer = () => {
        return (
            <div
                className={`${hasStory ? "bg-gradient-2" : ""} ${padding} rounded-full cursor-pointer ${className}`}
                onClick={handleAvatarClick}
            >
                <div className={`rounded-full ${childPadding} card-color`}>
                    <Avatar className={`w-9 h-9 ${avatarClassName}`}>
                        <AvatarImage src={avatar_url} />
                        <AvatarFallback className="">
                            <Icon name="user-round" className={`text-slate-500 font-light ${fallbackClassName}`} strokeWidth={fallbackStrokeWidth} />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        );
    }

    if (!userId) {
        return userAvatarContainer();
    }

    return (
        <UserInfoCard trigger={userAvatarContainer()} userId={userId} />
    );
}

export default AvatarContainer;