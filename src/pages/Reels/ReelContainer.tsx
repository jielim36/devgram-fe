import Icon from '@/components/Icon/Icon';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import React from 'react';

type ReelsContainerProps = {
    src: string;
};

const ReelsContainer: React.FC<ReelsContainerProps> = ({ src }) => {
    const videoUrl = `https://www.youtube.com/embed/${src}?autoplay=1`;

    return (
        <div className='relative aspect-reel w-[300px] xs:w-[400px]'>
            <AspectRatio ratio={9 / 16} className='rounded-md overflow-hidden'>
                <iframe
                    title="YouTube Video"
                    src={videoUrl}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
            </AspectRatio>
            <div className='absolute top-1/2 right-0 md:-right-[60px] flex flex-col gap-4 px-2'>
                <div className='flex flex-col gap-1 items-center hover:text-muted-foreground '>
                    <Icon name='heart' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                    <p className='text-white md:text-inherit tracking-wide'>1.6M</p>
                </div>
                <div className='flex flex-col gap-1 items-center hover:text-muted-foreground'>
                    <Icon name='send' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                    <p className='text-white md:text-inherit tracking-wide'>1.6M</p>
                </div>
                <div className='flex flex-col gap-1 items-center hover:text-muted-foreground'>
                    <Icon name='message-circle' className='text-white md:text-inherit w-6 h-6 xs:w-7 xs:h-7 cursor-pointer' />
                    <p className='text-white md:text-inherit tracking-wide'>1.6M</p>
                </div>
            </div>
        </div>
    );
};

export default ReelsContainer;