const CroppedImagePreview = ({ src }: { src: string }) => {
    return (
        <div className="relative flex p-4 justify-center items-center">
            <img src={src} className="w-full h-full" alt="" />
        </div>
    );
}

export default CroppedImagePreview;