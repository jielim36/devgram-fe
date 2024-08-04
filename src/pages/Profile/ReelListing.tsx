import Icon from "@/components/Icon/Icon";
import { Card } from "@/components/ui/card";
import { useGetReelsByUserId } from "@/hooks/useReel";
import { Reel, ResponseBody } from "@/types";
import { GenerateReelPlatformEmbedUrl } from "@/utils/ReelPlatformUrlUtils";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

type ReelListingProps = {
    profileUserId: number;
    onClickReel: (reel: Reel) => void;
    allowToViewProfile: boolean;
}

const ReelListing: React.FC<ReelListingProps> = ({ profileUserId, onClickReel, allowToViewProfile }) => {

    const { data: reelsData, isError, error } = useGetReelsByUserId({
        userId: profileUserId,
        enabled: !!profileUserId
    });

    const getErrorMsg = () => {
        const err = error as AxiosError;
        const errMsg = err?.response?.data as ResponseBody<string>;
        const result = errMsg?.data;
        return result;
    }

    if (reelsData?.data && reelsData.data.length === 0) {
        return (
            <div className="w-full xs:py-14 text-muted-foreground flex flex-col items-center justify-center">
                <Icon name="camera-off" className="w-10 h-10 font-light mb-2" />
                <p className="text-xl font-semibold">No reels yet</p>
            </div>
        );
    }

    if (!allowToViewProfile) {
        return (
            <div className="w-full py-10 text-muted-foreground flex flex-col items-center justify-center">
                <Icon name="ban" className="w-10 h-10 font-light" />
                <p className="">{isError && error ? getErrorMsg() : "You are not allowed to access this profile"}</p>
            </div>
        );
    }

    if (!reelsData?.data) {
        return (
            <div className="w-full py-10 text-muted-foreground flex flex-col items-center justify-center">
                <Icon name="loader-circle" className="animate-spin mx-auto" />
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-1">
                {reelsData?.data && reelsData?.data.map((reel, index) => {
                    return (
                        <ReelDialogContainer reel={reel} key={index} onClick={() => onClickReel(reel)} mode="preview" />
                    );
                })}
            </div>
        </>
    );
}

type ReelsContainerProps = {
    reel: Reel;
    onClick: () => void;
    mode: "preview" | "playing";
};

export const ReelDialogContainer: React.FC<ReelsContainerProps> = ({
    reel,
    onClick,
    mode
}) => {

    const previewUrl = GenerateReelPlatformEmbedUrl(reel.reel_url, reel.platform);
    const playingUrl = GenerateReelPlatformEmbedUrl(reel.reel_url, reel.platform) + "?autoplay=1";

    return (
        <Card className="aspect-reel overflow-hidden rounded-md" onClick={onClick}>
            <iframe
                title="YouTube Video"
                src={mode === "preview" ? previewUrl : playingUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    pointerEvents: mode === "preview" ? 'none' : 'auto',
                }}
                frameBorder="0"
                allow='autoplay; encrypted-media'
                allowFullScreen
            ></iframe>
        </Card >
    );
};

export default ReelListing;