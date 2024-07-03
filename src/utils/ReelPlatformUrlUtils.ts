import { ReelPlatformEnum } from "@/types"

enum ReelPlatformUrlEnum {
    YOUTUBE = "https://www.youtube.com/shorts/"
}

enum ReelPlatformEmbedUrlEnum {
    YOUTUBE = "https://www.youtube.com/embed/"
}

export const ReelPlatformCheck = (reel_url: string): string | undefined => {
    if (reel_url.startsWith(ReelPlatformUrlEnum.YOUTUBE)) {
        return ReelPlatformEnum.YOUTUBE;
    } else {
        return undefined;
    }
}

export const GenerateReelPlatformEmbedUrl = (reel_url: string, platform: string): string | undefined => {
    if (platform === ReelPlatformEnum.YOUTUBE) {
        return reel_url.replace(ReelPlatformUrlEnum.YOUTUBE, ReelPlatformEmbedUrlEnum.YOUTUBE);
    }
}