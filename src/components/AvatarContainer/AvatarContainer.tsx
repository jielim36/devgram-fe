import { UserRoundIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "@/style/color.css"

type AvatarContainerProps = {
    avatar_url?: string;
    hasStory: boolean;
    className?: string;
}

const AvatarContainer: React.FC<AvatarContainerProps> = ({ avatar_url, hasStory, className }) => {
    return (
        <div className={`${hasStory ? "bg-gradient-2" : ""} p-[2px] rounded-full ${className}`}>
            <div className="rounded-full p-[1px] card-color">
                <Avatar>
                    <AvatarImage src={avatar_url} />
                    <AvatarFallback>
                        <UserRoundIcon className="text-slate-500" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}

export default AvatarContainer;