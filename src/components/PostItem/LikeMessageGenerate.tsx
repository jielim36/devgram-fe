import { Like } from "@/types";
import AvatarContainer from "../AvatarContainer/AvatarContainer";

const LikeMessageGenerate = ({ likes }: { likes: Like[] }) => {

    if (likes.length === 0) return "";

    return (
        <div className="flex flex-row items-center text-sm">
            <div className={`flex flex-row ${likes.length > 1 ? "-mr-3" : ""}`}>
                <AvatarContainer avatar_url={likes[0].user.avatar_url} hasStory={false} avatarClassName={`w-5 h-5`} />
                {likes.length > 1 && <AvatarContainer avatar_url={likes[1].user.avatar_url} hasStory={false} avatarClassName={`w-5 h-5`} className="-translate-x-1/2" />}
            </div>
            <div>
                Liked by
                <span className="font-bold">
                    {" "}{likes[0]?.user?.username}{" "}{likes.length === 2 ? "and" : likes.length === 1 ? "" : ","}{likes[1]?.user?.username ? ` ${likes[1]?.user.username}` : ""}
                </span>
                {likes.length > 2 ? `and ${likes.length - 2} others` : ""}
            </div>
        </div>
    );

}

export default LikeMessageGenerate;