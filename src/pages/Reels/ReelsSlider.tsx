import { Button } from "@/components/ui/button";
import { useGetPopularReels } from "@/hooks/useReel";
import { useIntersection } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Navigation, Mousewheel } from 'swiper/modules';
import ReelsContainer from "./ReelContainer";
import { GenerateReelPlatformEmbedUrl } from "@/utils/ReelPlatformUrlUtils";
import { Reel } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/Icon/Icon";
import { set } from "date-fns";
import { nextTick } from "process";

const ReelsSlider = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [play, setPlay] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [popularReelsList, setPopularReelsList] = useState<Reel[]>([]);
    const [isNoRecordFound, setIsNoRecordFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lastPostRef = useRef<HTMLDivElement | null>(null);
    const [isError, setIsError] = useState(false);
    // const { ref, entry } = useIntersection({
    //     root: lastPostRef.current,
    //     threshold: 1,
    // });
    const popularReelsResult = useGetPopularReels({
        page: currentPage,
        enabled: !isLoading || !isError,
    });

    // const handleLoadMore = () => {
    //     if (popularReelsResult.isFetchingNextPage) return;
    //     if (popularReelsResult?.hasNextPage === false) return;
    //     if (isError) return;

    //     popularReelsResult.fetchNextPage({ cancelRefetch: true });
    // }

    // if (entry?.isIntersecting) {
    //     handleLoadMore();
    // }

    useEffect(() => {

        if (popularReelsResult.isError) {
            setIsError(true);
        }

        if (popularReelsResult?.isLoading || popularReelsResult?.isPending) {
            setIsLoading(true);
        }

        if (popularReelsResult?.isSuccess && popularReelsResult?.data?.data?.length === 0 && currentPage > 1) {
            setIsNoRecordFound(true);
        }

        // init first page data
        if (popularReelsResult?.isSuccess && popularReelsResult?.data?.data && currentPage === 1) {
            console.log("FETCH");
            setPopularReelsList([...popularReelsList, ...popularReelsResult.data.data]);
        }

    }, [popularReelsResult?.data?.data]);

    useEffect(() => {
        console.log("POPULAR REELS LIST", popularReelsList);
    }, [popularReelsList]);

    const handleLoadMore = () => {
        console.log("LOAD MORE");

        if (isError) {
            console.log("IS ERROR");
            return;
        }
        if (popularReelsResult?.data?.data?.length === 0) {
            console.log("NO RECORD FOUND");
            return;
        }

        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        console.log("CURRENT PAGE", nextPage);

    }

    const handleSlideChange = (swiper: any) => {
        setActiveIndex(swiper.activeIndex);
        setPlay(true);
    }

    return (
        <Swiper
            direction={'vertical'}
            modules={[Pagination, Navigation, Mousewheel]}
            navigation
            mousewheel
            className="relative mySwiper h-[82vh] overflow-hidden w-full py-10 xs:py-0"
            spaceBetween={30}
            touchStartPreventDefault={false}
            touchStartForcePreventDefault={false}
            onSlideChange={handleSlideChange}
            onReachEnd={handleLoadMore}
        >
            {popularReelsList.map((reel: Reel, index) => (
                <SwiperSlide key={index} className="w-full flex justify-center">
                    <div onClick={() => setPlay(!play)}>
                        <ReelsContainer reel={reel} isPlaying={activeIndex === index && play} />
                    </div>
                </SwiperSlide>
            ))}

            {/* For desktop */}
            <div className="hidden absolute right-1/2 top-0 translate-x-[255px] h-full xs:flex flex-col justify-between py-5">
                <SlidePrevButton />
                <SlideNextButton />
            </div>

            {/* For mobile */}
            <div className="flex flex-col justify-between xs:hidden absolute top-0 right-1/2 translate-x-1/2 w-[300px]">
                <SlidePrevButton className={`w-full ${activeIndex === 0 ? "opacity-0" : ""}`} variant="ghost" disabled={activeIndex === 0} />
                <div
                    className="w-full aspect-reel"
                    style={{ pointerEvents: "none" }}
                    onClick={() => setPlay(!play)}
                />
                <SlideNextButton className="w-full" variant="ghost" />
            </div>
        </Swiper>
    );
}

function SlideNextButton({ className, variant = "secondary" }: { className?: string, variant?: "secondary" | "ghost" }) {
    const swiper = useSwiper();

    return (
        <Button
            variant={variant}
            size={"icon"}
            className={className}
            onClick={() => swiper.slideNext()}
        >
            <Icon name='chevron-down' className='w-6 h-6' />
        </Button>
    );
}

function SlidePrevButton({ className, variant = "secondary", disabled = false }: { className?: string, variant?: "secondary" | "ghost", disabled?: boolean }) {
    const swiper = useSwiper();

    return (
        <Button
            variant={variant}
            size={"icon"}
            className={className}
            onClick={() => swiper.slidePrev()}
        // disabled={disabled}
        >
            <Icon name='chevron-up' className='w-6 h-6' />
        </Button>
    );
}

export default ReelsSlider;