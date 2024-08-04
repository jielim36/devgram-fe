import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";
import getCroppedImg from "@/utils/cropImage";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAddPost } from "@/hooks/usePosts";
import { useTheme } from "@/utils/ThemeProvider";
import InputWithEmoji from "../InputWithEmoji/InputWithEmoji";
import Icon from "../Icon/Icon";
import SortableImageList from "./SortableImageList";
import toast from "react-hot-toast";


export type ImageCropContainerProps = {
    trigger: React.ReactNode;
    // user: User;
}

type ImageCrop = {
    // user: User;
    // image: string;
}

type SliderProps = React.ComponentProps<typeof Slider>;

const ImageCropContainer: React.FC<ImageCropContainerProps> = ({ trigger }) => {

    return (
        <Dialog >
            <DialogTrigger asChild>
                {/* <div className="bg-gradient py-2 px-4 rounded-sm hover:scale-110 transition duration-300 ease-in-out"> */}
                {trigger}
            </DialogTrigger>
            <DialogContent disableCloseBtn className="p-1">
                <ImageCrop />
            </DialogContent>
        </Dialog>
    );
}

export type ImgType = {
    id: number;
    src: string;
    crop: Point;
    zoom: number;
    rotation: number;
    croppedAreaPixels: Area;
}

const ImageCrop: React.FC<ImageCrop> = () => {

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

    const handleAddPost = async () => {
        if (imgList?.length > 0) {
            const imgBlobArray: Blob[] = [];

            for (let i = 0; i < imgList?.length; i++) {

                const src = imgList[i].src;
                if (!src) {
                    return;
                }
                const croppedAreaPixels = imgList[i].croppedAreaPixels;

                const rotation = imgList[i].rotation || 0;

                const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
                if (!blob) return;
                imgBlobArray.push(blob);
            }
            if (!imgBlobArray || !imgBlobArray[0]) return;
            // const { data } = useGetMe();
            const description = postDescription || "";

            toast.promise(addPostMutation.mutateAsync({ description, imgBlobArray }), {
                loading: "Adding post",
                success: "Post added",
                error: "Error adding post"
            });

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
                        id: index + 1,
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

        setCurrentEditingIndex(0);
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
                            id: prev.length + index + 1,
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
                <Icon name="arrow-right-left" className="translate-y-[1px]" width={12} />
                Drag to change order
            </p>
            <div className="h-[8%] flex flex-row items-center px-2">
                <div className="flex flex-row gap-4 grow h-full items-center">
                    <div className="max-h-full flex justify-center items-center">
                        <SortableImageList
                            imgList={imgList}
                            setImgList={setImgList}
                            currentEditingIndex={currentEditingIndex}
                            setCurrentEditingIndex={setCurrentEditingIndex}
                            onDeleteImg={handleDeleteImg}
                        />
                    </div>
                    <Button className="h-[50px]" onClick={onAddNewImage} disabled={imgList?.length >= 9}>
                        <Icon name="plus" />
                    </Button>
                </div>
                <Button className="ml-2" onClick={handleConfirmPost}>Confirm</Button>
            </div>

            <div className="relative h-[80%] sm:h-[80%] rounded-md overflow-hidden">
                <Cropper
                    image={imgList[currentEditingIndex]?.src}
                    crop={imgList[currentEditingIndex]?.crop || { x: 0, y: 0 }}
                    zoom={imgList[currentEditingIndex]?.zoom || 1}
                    rotation={imgList[currentEditingIndex]?.rotation || 0}
                    aspect={1 / 1}
                    onCropChange={onSetCrop}
                    onZoomChange={onSetZoom}
                    onRotationChange={onSetRotation}
                    onCropComplete={onCropComplete}
                    classes={{ containerClassName: "card-color" }}
                />
            </div>

            <EditPanel
                imageSrc={imgList[currentEditingIndex]?.src}
                crop={imgList[currentEditingIndex]?.crop}
                zoom={imgList[currentEditingIndex]?.zoom}
                rotation={imgList[currentEditingIndex]?.rotation}
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
    containerClassName?: string;
}

export const EditPanel: React.FC<EditPanelProps> = ({ imageSrc, crop, zoom, rotation, onCropChange, onZoomChange, onRotationChange, onCropComplete, containerClassName }) => {
    return (
        <div className={containerClassName ?? "flex flex-col sm:flex-row sm:items-center  px-4 h-[16%] sm:h-fit mt-2"}>
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