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
import { ArrowRightLeftIcon, CircleXIcon, PlusIcon, SmilePlusIcon, XIcon } from "lucide-react";
import { Reorder } from "framer-motion"
import { motion } from "framer-motion"
import { Badge } from "../ui/badge";
import { set } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import EmojiPicker from 'emoji-picker-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import InputWithEmoji from "../InputWithEmoji/InputWithEmoji";


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

type ImgType = {
    id: number;
    src: string;
    crop: Point;
    zoom: number;
    rotation: number;
    croppedAreaPixels: Area;
}

const ImageCrop: React.FC<ImageCrop> = ({ user }) => {

    const [currentEditingIndex, setCurrentEditingIndex] = useState(0);
    const [imgList, setImgList] = useState<ImgType[]>([]);
    const [postDescription, setPostDescription] = useState<string>("");

    const { theme } = useTheme();
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isOpenPreview, setIsOpenPreview] = useState(false);
    const [isShowDescriptionInput, setIsShowDescriptionInput] = useState(false);
    const addPostMutation = useAddPost({
        onSuccess: (data) => {
            if (!data.data) return;
            // TODO: show success message
            // navigate to home page
            window.location.href = import.meta.env.VITE_WEBSITE_URL + "/";
        }
    });

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setImgList((prev) => {
            const newImgList = [...prev];
            newImgList[currentEditingIndex].croppedAreaPixels = croppedAreaPixels;
            return newImgList;
        })
    }

    // const croppedImagePreview = async () => {

    //     if (!croppedAreaPixels || !imageSrc || !croppedAreaPixels) {
    //         return
    //     }

    //     try {
    //         const croppedImage = await generatePreviewImage(
    //             imageSrc[currentEditingIndex],
    //             croppedAreaPixels[currentEditingIndex],
    //             rotation[currentEditingIndex]
    //         )
    //         // console.log('donee', { croppedImage })
    //         if (!croppedImage) return;
    //         setCroppedImage(croppedImage);
    //         setIsOpenPreview(true);
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }


    const handleAddPost = async () => {
        if (imgList?.length > 0) {
            const imgBlobArray: Blob[] = [];

            for (let i = 0; i < imgList?.length; i++) {
                const blob = await getCroppedImg(imgList[i].src, imgList[i].croppedAreaPixels, imgList[i].rotation);
                if (!blob) return;
                imgBlobArray.push(blob);
            }
            if (!imgBlobArray || !imgBlobArray[0]) return;
            // const { data } = useGetMe();
            const userId = user.id;
            const description = postDescription || "";

            if (!userId) return;
            addPostMutation.mutate({ userId, description, imgBlobArray });

        }
    }

    const handleConfirmPost = () => {
        setIsShowDescriptionInput(true);
    }

    const onSetCrop = (crop: Point) => {
        setImgList((prev) => {
            const newImgList = [...prev];
            newImgList[currentEditingIndex].crop = crop;
            return newImgList;
        })
    }

    const onSetZoom = (zoom: number) => {
        setImgList((prev) => {
            const newImgList = [...prev];
            newImgList[currentEditingIndex].zoom = zoom;
            return newImgList;
        })
    }

    const onSetRotation = (rotation: number) => {
        setImgList((prev) => {
            const newImgList = [...prev];
            newImgList[currentEditingIndex].rotation = rotation;
            return newImgList;
        })
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
                    setImgList(results.map((src, index) => ({
                        id: index,
                        src: src,
                        crop: { x: 0, y: 0 },
                        zoom: 1,
                        rotation: 0,
                        croppedAreaPixels: { x: 0, y: 0, width: 0, height: 0 },
                    })));
                })
                .catch(error => console.error("Error reading files:", error));
        }
    };

    const onSwithImage = (index: number) => {
        setCurrentEditingIndex(index);
    }

    const handleDeleteImg = (imgId: number) => {
        setImgList((prev) => {
            const newImgList = prev.filter(img => img?.id !== imgId);
            return newImgList;
        });
        setCurrentEditingIndex(currentEditingIndex - 1 < 0 ? 0 : currentEditingIndex - 1);

        //reset index of images that behind the deleted image
        setImgList((prev) => {
            const newImgList = prev.map((img, index) => {
                if (img.id > imgId) {
                    return { ...img, id: img.id - 1 }
                }
                return img;
            });
            return newImgList;
        });
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

            if (target.files && target.files.length + imgList?.length > 9) {
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
                        setImgList((prev) => [...prev, ...results.map((src, index) => ({
                            id: prev.length + index,
                            src: src,
                            crop: { x: 0, y: 0 },
                            zoom: 1,
                            rotation: 0,
                            croppedAreaPixels: { x: 0, y: 0, width: 0, height: 0 },
                        }))]);
                    })
                    .catch(error => console.error("Error reading files:", error));
            }
        };
        document.body.appendChild(input);
        input.click();
        input.remove();
    }

    if (!imgList || imgList?.length === 0) {
        return (
            <div className="p-4 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" className="cursor-pointer" onChange={onSelectFile} multiple />
            </div>
        );
    }

    if (isShowDescriptionInput) {
        return (
            <div className="flex flex-col gap-6 p-4 w-[90vw] sm:w-[600px] max-h-[95vh] overflow-hidden">
                <InputWithEmoji
                    content={postDescription}
                    setContent={setPostDescription}
                    label="Description"
                    containerClassName="p-1 flex flex-col gap-3"
                />
                <div className="grid grid-cols-2 gap-10 px-6">
                    <Button onClick={() => setIsShowDescriptionInput(false)}>Cancel</Button>
                    <Button onClick={handleAddPost}>Add Post</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[90vw] h-[90vh] lg:w-[70vw] relative">
            <p className="text-xs px-4 py-[1px] text-muted-foreground flex items-center gap-1">
                <ArrowRightLeftIcon width={12} className="translate-y-[1px]" />
                Drag to change order
            </p>
            <div className="h-[8%] flex flex-row items-center px-2">
                <div className="h-full flex flex-row items-center grow">
                    <Reorder.Group
                        axis="x"
                        values={imgList}
                        onReorder={setImgList}
                        className="h-full w-fit flex flex-row gap-3 p-1"
                    >
                        {imgList?.map((img, index) => (
                            <Reorder.Item
                                key={img?.id}
                                value={img}
                                className="relative h-full group"
                                onPointerUp={() => onSwithImage(index)}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{
                                    opacity: 1,
                                    backgroundColor: index === currentEditingIndex ? "#f3f3f3" : "#fff",
                                    y: 0,
                                    transition: { duration: 0.15 }
                                }}
                                whileDrag={{ backgroundColor: "#e3e3e3" }}
                                exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                            >
                                <motion.div className={`h-full aspect-square flex justify-center col-span-1 cursor-pointer rounded-md overflow-hidden p-1 card-color
                                    ${index === currentEditingIndex ? `duration-300 scale-110 border-2 border-slate-900 ${theme === "light" ? "border-slate-900" : "border-white"}` : ""}`}
                                >
                                    <motion.img src={img?.src} alt="image" className="w-auto h-full object-cover select-none" draggable="false" />
                                </motion.div>
                                <motion.div className="absolute top-0 left-0 rounded-full border-2 text-xs font-bold h-[18px] w-[18px] bg-slate-400 flex justify-center items-center -translate-y-1 -translate-x-1">{index + 1}</motion.div>
                                <motion.div
                                    className="absolute top-0 right-0 rounded-full text-white h-4 w-4 bg-red-500 justify-center items-center -translate-y-1 translate-x-1 hidden group-hover:flex cursor-pointer"
                                    onClick={() => { handleDeleteImg(img?.id) }}
                                >
                                    <XIcon width={10} />
                                </motion.div>
                            </Reorder.Item>
                        ))}
                        {/* Add button as Reorder Item for animation when delete a image */}
                        <Reorder.Item
                            key={"unique"}
                            value={null}
                            className="relative h-full group"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.15 }
                            }}
                            whileDrag={{ backgroundColor: "#e3e3e3" }}
                            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
                        >
                            <Button className="ml-1 px-2 h-[90%] aspect-square flex items-center justify-center" onClick={onAddNewImage} disabled={imgList?.length >= 9}>
                                <PlusIcon />
                            </Button>
                        </Reorder.Item>
                    </Reorder.Group>
                </div>
                <Button className="ml-2" onClick={handleConfirmPost}>Confirm</Button>
            </div>

            <div className="relative h-[80%] sm:h-[80%] rounded-md overflow-hidden">
                <Cropper
                    image={imgList[currentEditingIndex]?.src}
                    crop={imgList[currentEditingIndex]?.crop}
                    zoom={imgList[currentEditingIndex]?.zoom}
                    rotation={imgList[currentEditingIndex]?.rotation}
                    aspect={1 / 1}
                    onCropChange={onSetCrop}
                    onZoomChange={onSetZoom}
                    onRotationChange={onSetRotation}
                    onCropComplete={onCropComplete}
                    classes={{ containerClassName: "card-color" }}
                />
            </div>

            <EditPanel
                imageSrc={imgList[currentEditingIndex].src}
                crop={imgList[currentEditingIndex].crop}
                zoom={imgList[currentEditingIndex].zoom}
                rotation={imgList[currentEditingIndex].rotation}
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
                    value={[zoom]}
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
                    value={[rotation]}
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

export default ImageCropContainer;