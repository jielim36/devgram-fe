import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import getCroppedImg, { generateDownload, generatePreviewImage } from "@/utils/cropImage";
import CroppedImagePreview from "./CroppedImagePreview";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type ImageCropContainerProps = {
    trigger: React.ReactNode;
}

type ImageCrop = {
    // image: string;
}

type SliderProps = React.ComponentProps<typeof Slider>;

const ImageCropContainer: React.FC<ImageCropContainerProps> = ({ trigger }) => {

    return (
        <Dialog >
            <DialogTrigger>
                {trigger}
            </DialogTrigger>
            <DialogContent disableCloseBtn className="p-2">
                <ImageCrop />
            </DialogContent>
        </Dialog>
    );
}

const ImageCrop: React.FC<ImageCrop> = () => {

    // const imageSrc = "https://i.pinimg.com/564x/06/04/23/060423aa8608e12c76c5f653cf6bc1fc.jpg"
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const croppedImagePreview = async () => {

        if (!croppedAreaPixels || !imageSrc || !croppedAreaPixels) {
            return
        }

        try {
            const croppedImage = await generatePreviewImage(
                imageSrc,
                croppedAreaPixels,
                rotation
            )
            // console.log('donee', { croppedImage })
            if (!croppedImage) return;
            setCroppedImage(croppedImage);
            setIsOpenPreview(true);
        } catch (e) {
            console.error(e)
        }
    }

    const onDownload = () => {
        if (imageSrc && croppedAreaPixels) {
            generateDownload(imageSrc, croppedAreaPixels, rotation);
        }
    }

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Notes: the uploaded image size might be greather than original image size, because it is using base64 format
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                console.log(e.target?.result);
            }
            reader.readAsDataURL(e.target.files[0]);

        }
    }

    if (!imageSrc) {
        return (
            <div className="p-4 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" className="cursor-pointer" onChange={onSelectFile} />
            </div>
        );
    }

    return (
        <div className="w-[90vw] h-[90vh] lg:w-[70vw] relative">
            <div className="relative h-[84%] sm:h-[92%] rounded-md overflow-hidden">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center px-4 h-[16%] sm:h-[8%]">
                <div className="flex flex-col grow">
                    <div className="flex flex-row items-center w-full bg-slate-40">
                        <p className="w-24">Zoom</p>
                        <Slider
                            defaultValue={[1]}
                            min={1}
                            max={3}
                            step={0.1}
                            className={cn("w-[60%]", "")}
                            onValueChange={(value) => setZoom(value[0])}
                        />
                    </div>
                    <div className="flex flex-row items-center w-full bg-slate-40">
                        <p className="w-24">Rotation</p>
                        <Slider
                            defaultValue={[0]}
                            min={0}
                            max={360}
                            step={1}
                            className={cn("w-[60%]", "")}
                            onValueChange={(value) => setRotation(value[0])}
                        />
                    </div>
                </div>
                <div className="flex flex-row items-center gap-3 justify-between">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between gap-1">
                            <p>Zoom</p>
                            <p>: {zoom}</p>
                        </div>
                        <div className="flex flex-row justify-between gap-1">
                            <p>Rotation</p>
                            <p>: {rotation}</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button onClick={croppedImagePreview}>Preview</Button>
                        <Button onClick={onDownload}>Confirm</Button>
                    </div>

                    <Dialog open={isOpenPreview}>
                        <DialogContent disableCloseBtn className="p-1 max-h-[90vw] max-w-[90vw]">
                            <div className="flex flex-col items-center">
                                <CroppedImagePreview src={croppedImage || ""} />
                                <Button onClick={() => { setIsOpenPreview(false) }} className="w-full">Close</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div >
    );
}

export function ZoomSlider({ className, ...props }: SliderProps) {
    return (
        <Slider
            defaultValue={[50]}
            min={0.8}
            max={100}
            step={1}
            className={cn("w-[60%]", className)}
            {...props}
        />
    )
}

export default ImageCropContainer;