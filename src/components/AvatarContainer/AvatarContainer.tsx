import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "@/style/color.css"
import Icon from "../Icon/Icon";

type AvatarContainerProps = {
    avatar_url?: string;
    hasStory: boolean;
    className?: string;
    avatarClassName?: string;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({ avatar_url, hasStory, className, avatarClassName }) => {
    return (
        <div className={`${hasStory ? "bg-gradient-2" : ""} p-[2px] rounded-full cursor-pointer ${className}`}>
            <div className="rounded-full p-[1px] card-color">
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