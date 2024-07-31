import { Card } from "@/components/ui/card";
import { useGetReelsByUserId } from "@/hooks/useReel";
import { Reel } from "@/types";
import { GenerateReelPlatformEmbedUrl } from "@/utils/ReelPlatformUrlUtils";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";

type ReelListingProps = {
    profileUserId: number;
    onClickReel: (reel: Reel) => void;
}

const ReelListing: React.FC<ReelListingProps> = ({ profileUserId, onClickReel }) => {

    const { data: reelsData, isError } = useGetReelsByUserId({
        userId: profileUserId,
        enabled: !!profileUserId
    });

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