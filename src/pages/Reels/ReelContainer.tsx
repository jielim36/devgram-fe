import Icon from '@/components/Icon/Icon';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Reel } from '@/types';
import { GenerateReelPlatformEmbedUrl } from '@/utils/ReelPlatformUrlUtils';
import React, { useEffect, useRef } from 'react';

type ReelsContainerProps = {
    reel: Reel;
    isPlaying?: boolean;
};

const ReelsContainer: React.FC<ReelsContainerProps> = ({ reel, isPlaying = false }) => {

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const playVideo = () => {
        if (!iframeRef?.current?.contentWindow) return;

        iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            '*'
        );
    };

    const pauseVideo = () => {
        if (!iframeRef?.current?.contentWindow) return;

        iframeRef.current.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
        );
    };

    useEffect(() => {
        if (isPlaying) {
            playVideo();
        } else {
            pauseVideo();
        }
    });

    return (
        <div className='relative aspect-reel w-[300px] xs:w-[400px]'>
            <AspectRatio ratio={9 / 16} className='rounded-md overflow-hidden'>
                <iframe
                    ref={iframeRef}
                    title="YouTube Video"
                    src={GenerateReelPlatformEmbedUrl(reel.reel_url, reel.platform) + "?autoplay=1&enablejsapi=1"}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                    frameBorder="0"
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                ></iframe>
            </AspectRatio>
            <div className='absolute top-1/2 right-0 md:-right-[60px] flex flex-col gap-4 px-2'>
                <div className='flex flex-col gap-0 items-center hover:text-muted-foreground '>
                    <Icon name='heart' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                    <p className='text-white md:text-inherit tracking-wide'>{reel.likeCount || 0}</p>
                </div>
                <div className='flex flex-col gap-0 items-center hover:text-muted-foreground'>
                    <Icon name='message-circle' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                    <p className='text-white md:text-inherit tracking-wide'>{reel.commentCount || 0}</p>
                </div>
                <div className='flex flex-col gap-1 items-center hover:text-muted-foreground'>
                    <Icon name='send' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                </div>
            </div>
        </div >
    );
};

export default ReelsContainer;