import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Controller } from 'swiper/modules';
import 'swiper/css';
import { Badge } from '../ui/badge';
import { AspectRatio } from '../ui/aspect-ratio';
import { useState } from 'react';
import "@/style/color.css"

type SwiperContainerProps = {
    postImages: string[];
    className?: string;
}

const PostSwiper: React.FC<SwiperContainerProps> = ({ postImages, className }) => {

    const [swiper, setSwiper] = useState<any>();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSlideChange = () => {
        setCurrentImageIndex(swiper.activeIndex);
    }

    return (
        <div className={`relative ${className}`}>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                spaceBetween={50}
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                pagination={true}
                modules={[EffectCoverflow, Pagination, Controller]}
                controller={{ control: swiper }}
                className='select-none'
                onSlideChange={handleSlideChange}
                onSwiper={setSwiper}
            >
                {postImages?.map((image, index) => (
                    <SwiperSlide key={index} className=''>
                        <AspectRatio ratio={1} className='card-color flex'>
                            <img src={image} alt="" className='object-cover w-full h-auto aspect-square' />
                        </AspectRatio>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Badge className="absolute top-2 right-2 z-10">{currentImageIndex + 1}/{postImages.length}</Badge>
        </div>
    );
};

export default PostSwiper;