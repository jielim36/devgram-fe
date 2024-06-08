import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { ChangeEvent, useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import getCroppedImg, { generateDownload, generatePreviewImage } from "@/utils/cropImage";
import CroppedImagePreview from "./CroppedImagePreview";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axiosClient from "@/utils/axiosClient";
import { useGetMe } from "@/hooks/useUsers";
import { useAddPost } from "@/hooks/usePosts";
import { User } from "@/types";
import { on } from "events";
import { useTheme } from "@/utils/ThemeProvider";
import { PlusIcon } from "lucide-react";
import { Reorder } from "framer-motion"
import { motion } from "framer-motion"
import { Badge } from "../ui/badge";

type ImageCropContainerProps = {
    trigger: React.ReactNode;
    user: User;
}

type ImageCrop = {
    user: User;
    // image: string;
}

type SliderProps = React.ComponentProps<typeof Slider>;

const ImageCropContainer: React.FC<ImageCropContainerProps> = ({ trigger, user }) => {

    return (
        <Dialog >
            <DialogTrigger>
                <div className="bg-gradient py-2 px-4 rounded-sm hover:scale-110 transition duration-300 ease-in-out">
                    {trigger}
                </div>
            </DialogTrigger>
            <DialogContent disableCloseBtn className="p-1">
                <ImageCrop user={user} />
            </DialogContent>
        </Dialog>
    );
}

const ImageCrop: React.FC<ImageCrop> = ({ user }) => {

    const [imageSrc, setImageSrc] = useState<string[]>([]);
    const [currentEditingIndex, setCurrentEditingIndex] = useState(0);
    const [crop, setCrop] = useState<Point[]>([]);
    const [zoom, setZoom] = useState<number[]>([]);
    const [rotation, setRotation] = useState<number[]>([])
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area[]>([]);
    const { theme } = useTheme();
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const addPostMutation = useAddPost({
        onSuccess: (data) => {
            // console.log(data);
            if (!data.data) return;

            console.log("Success");
            // navigate to home page
            window.location.href = import.meta.env.VITE_WEBSITE_URL + "/";
        }
    });

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels((prev) => {
            const newCroppedAreaPixels = [...prev];
            newCroppedAreaPixels[currentEditingIndex] = croppedAreaPixels;
            return newCroppedAreaPixels;
        })
    }

    const croppedImagePreview = async () => {

        if (!croppedAreaPixels || !imageSrc || !croppedAreaPixels) {
            return
        }

        try {
            const croppedImage = await generatePreviewImage(
                imageSrc[currentEditingIndex],
                croppedAreaPixels[currentEditingIndex],
                rotation[currentEditingIndex]
            )
            // console.log('donee', { croppedImage })
            if (!croppedImage) return;
            setCroppedImage(croppedImage);
            setIsOpenPreview(true);
        } catch (e) {
            console.error(e)
        }
    }


    const handleAddPost = async () => {
        if (imageSrc && croppedAreaPixels) {
            const imgBlobArray: Blob[] = [];

            for (let i = 0; i < imageSrc.length; i++) {
                const blob = await getCroppedImg(imageSrc[i], croppedAreaPixels[currentEditingIndex], rotation[currentEditingIndex]);
                if (!blob) return;
                imgBlobArray.push(blob);
            }
            if (!imgBlobArray || !imgBlobArray[0]) return;
            // const { data } = useGetMe();
            const userId = user.id;
            const description: string = "This is a test description";

            if (!userId) return;
            addPostMutation.mutate({ userId, description, imgBlobArray });

        }
    }

    const onSetCrop = (crop: Point) => {
        setCrop((prev) => {
            const newCrop = [...prev];
            newCrop[currentEditingIndex] = crop;
            return newCrop;
        });
    }

    const onSetZoom = (zoom: number) => {
        setZoom((prev) => {
            const newZoom = [...prev];
            newZoom[currentEditingIndex] = zoom;
            return newZoom;
        });
    }

    const onSetRotation = (rotation: number) => {
        setRotation((prev) => {
            const newRotation = [...prev];
            newRotation[currentEditingIndex] = rotation;
            return newRotation;
        });
    }

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 9) {
            // TODO: remind user that the maximum number of images is 9
        }

        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const readers = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers)
                .then(results => {
                    setImageSrc(results);
                    setCrop(results.map(() => ({ x: 0, y: 0 })));
                    setZoom(results.map(() => 1));
                    setRotation(results.map(() => 0));
                })
                .catch(error => console.error("Error reading files:", error));
        }
    };

    // useEffect(() => {
    //     console.log("imageSrc", imageSrc);
    // }, [imageSrc])

    const onSwithImage = (index: number) => {
        setCurrentEditingIndex(index);
    }

    const onAddNewImage = () => {
        // select new image from local
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;

            if (target.files && target.files.length + imageSrc.length > 9) {
                //TODO: remind user that the maximum number of images is 9
                return;
            }

            if (target.files && target.files.length > 0) {
                const files = Array.from(target.files);
                const readers = files.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => reject(reader.error);
                        reader.readAsDataURL(file);
                    });
                });

                Promise.all(readers)
                    .then(results => {
                        setImageSrc((prev) => [...prev, ...results]);
                        setCrop((prev) => [...prev, ...results.map(() => ({ x: 0, y: 0 }))]);
                        setZoom((prev) => [...prev, ...results.map(() => 1)]);
                        setRotation((prev) => [...prev, ...results.map(() => 0)]);
                        setCurrentEditingIndex(imageSrc.length);
                    })
                    .catch(error => console.error("Error reading files:", error));
            }
        };
        document.body.appendChild(input);
        input.click();
        input.remove();
    }

    if (!imageSrc || imageSrc.length === 0) {
        return (
            <div className="p-4 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" className="cursor-pointer" onChange={onSelectFile} multiple />
            </div>
        );
    }

    return (
        <div className="w-[90vw] h-[90vh] lg:w-[70vw] relative">
            {/* <div className="h-[8%] flex flex-row justify-between">
                <div className={`h-full flex flex-row gap-2 p-1 justify-center items-center`}>
                    {imageSrc.map((src, index) => (
                        <div key={index}
                            className={`h-full aspect-square flex justify-center col-span-1 cursor-pointer rounded-md overflow-hidden p-1
                        ${index === currentEditingIndex ? `duration-200 scale-110 border-2 border-slate-900 ${theme === "light" ? "border-slate-900" : "border-white"}` : ""}`}
                            onClick={() => onSwithImage(index)}
                        >
                            <img src={src} alt="image" className="w-auto h-full object-cover" />
                        </div>
                    ))}
                    <Button className="px-2 h-full aspect-square flex items-center justify-center">
                        <PlusIcon />
                    </Button>
                </div>
                <div className="flex flex-row gap-2">
                    <Button onClick={() => { setImageSrc(null) }}>Cancel</Button>
                    <Button onClick={croppedImagePreview}>Preview</Button>
                    <Button onClick={handleAddPost}>Confirm</Button>
                </div>
            </div> */}
            <div className="h-[8%] flex flex-row">
                <Reorder.Group
                    axis="x"
                    values={imageSrc}
                    onReorder={setImageSrc}
                    className="h-full flex flex-row gap-2 p-1"
                >
                    {imageSrc.map((src, index) => (
                        <Reorder.Item
                            key={src}
                            value={src}
                            className="relative h-full"
                            onPointerUp={() => onSwithImage(index)}
                        >
                            <div className={`h-full aspect-square flex justify-center col-span-1 cursor-pointer rounded-md overflow-hidden p-1 card-color
                                ${index === currentEditingIndex ? `duration-200 scale-110 border-2 border-slate-900 ${theme === "light" ? "border-slate-900" : "border-white"}` : ""}`}
                            >
                                <img src={src} alt="image" className="w-auto h-full object-cover select-none" draggable="false" />
                            </div>
                            <div className="absolute top-0 left-0 rounded-full border-2 text-xs font-bold h-[18px] w-[18px] bg-slate-400 flex justify-center items-center -translate-y-1 -translate-x-1">{index + 1}</div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
                <Button className="px-2 h-full aspect-square flex items-center justify-center" onClick={onAddNewImage}>
                    <PlusIcon />
                </Button>
            </div>

            <div className="relative h-[80%] sm:h-[86%] rounded-md overflow-hidden">
                <Cropper
                    image={imageSrc[currentEditingIndex]}
                    crop={crop[currentEditingIndex]}
                    zoom={zoom[currentEditingIndex]}
                    rotation={rotation[currentEditingIndex]}
                    aspect={1 / 1}
                    onCropChange={onSetCrop}
                    onZoomChange={onSetZoom}
                    onRotationChange={onSetRotation}
                    onCropComplete={onCropComplete}
                    classes={{ containerClassName: "card-color" }}
                />
            </div>

            <EditPanel
                imageSrc={imageSrc[currentEditingIndex]}
                crop={crop[currentEditingIndex]}
                zoom={zoom[currentEditingIndex]}
                rotation={rotation[currentEditingIndex]}
                onCropChange={onSetCrop}
                onZoomChange={onSetZoom}
                onRotationChange={onSetRotation}
                onCropComplete={onCropComplete}
            />


        </div >
    );
}

type EditPanelProps = {
    imageSrc: string;
    crop: Point;
    zoom: number;
    rotation: number;
    onCropChange: (crop: Point) => void;
    onZoomChange: (zoom: number) => void;
    onRotationChange: (rotation: number) => void;
    onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
}

const EditPanel: React.FC<EditPanelProps> = ({ imageSrc, crop, zoom, rotation, onCropChange, onZoomChange, onRotationChange, onCropComplete }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center  px-4 h-[16%] sm:h-fit mt-2">
            <div className="flex flex-row w-full">
                <p className="w-16 sm:w-fit">Zoom</p>
                <p>: {zoom}</p>
                <Slider
                    defaultValue={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    className={cn("w-[60%]", "ml-2")}
                    onValueChange={(value) => onZoomChange(value[0])}
                />
            </div>
            <div className="flex flex-row w-full">
                <p className="w-16 sm:w-fit">Rotation</p>
                <p>: {rotation}</p>
                <Slider
                    defaultValue={[rotation]}
                    min={0}
                    max={360}
                    step={1}
                    className={cn("w-[60%]", "ml-2")}
                    onValueChange={(value) => onRotationChange(value[0])}
                />
            </div>
        </div>
    );
}
{/* <div className="flex flex-row gap-2">
            <Button onClick={() => { (null) }}>Cancel</Button>
            <Button onClick={croppedImagePreview}>Preview</Button>
            <Button onClick={handleAddPost}>Confirm</Button>
        </div> */}

{/* <Dialog open={isOpenPreview}>
            <DialogContent disableCloseBtn className="p-1 max-h-[90vw] max-w-[90vw]">
                <div className="flex flex-col items-center">
                    <CroppedImagePreview src={croppedImage || ""} />
                    <Button onClick={() => { setIsOpenPreview(false) }} className="w-full">Close</Button>
                </div>
            </DialogContent>
        </Dialog> */}

// export function ZoomSlider({ className, ...props }: SliderProps) {
//     return (
//         <Slider
//             defaultValue={[50]}
//             min={0.8}
//             max={100}
//             step={1}
//             className={cn("w-[60%]", className)}
//             {...props}
//         />
//     )
// }

export default ImageCropContainer;