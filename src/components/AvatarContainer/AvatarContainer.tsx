import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "@/style/color.css"
import Icon from "../Icon/Icon";

type AvatarContainerProps = {
    avatar_url?: string;
    hasStory: boolean;
    className?: string;
    avatarClassName?: string;
    boldBorder?: boolean;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({ avatar_url, hasStory, className, avatarClassName, boldBorder = false }) => {

    const padding = boldBorder ? "p-[4px]" : "p-[2px]";
    const childPadding = boldBorder ? "p-[2px]" : "p-[1px]";

    return (
        <div className={`${hasStory ? "bg-gradient-2" : ""} ${padding} rounded-full cursor-pointer ${className}`}>
            <div className={`rounded-full ${childPadding} card-color`}>
                <Avatar className={`w-9 h-9 ${avatarClassName}`}>
                    <AvatarImage src={avatar_url} />
                    <AvatarFallback>
                        <Icon name="user-round" className="text-slate-500" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}

export default AvatarContainer;