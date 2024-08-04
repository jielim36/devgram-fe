import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import getCroppedImg from "@/utils/cropImage";
import { useAddPost } from "@/hooks/usePosts";
import { useTheme } from "@/utils/ThemeProvider";
import toast from "react-hot-toast";
import { EditPanel, ImageCropContainerProps, ImgType } from "@/components/ImageCrop/ImageCrop";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Icon from "@/components/Icon/Icon";
import { uploadAvatar } from "@/services";
import { useUploadAvatar } from "@/hooks";

type customAvatarContainerProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AvatarUploaderDialog: React.FC<ImageCropContainerProps & customAvatarContainerProps> = ({
    trigger,
    isOpen,
    setIsOpen
}) => {

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent disableCloseBtn className="p-1">
                <ImageCrop setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    );
}

export default AvatarUploaderDialog;

type ImageCropProps = {
    setIsOpen: (isOpen: boolean) => void;
}

const ImageCrop: React.FC<ImageCropProps> = ({
    setIsOpen
}) => {
    const [avatarImage, setAvatarImage] = useState<ImgType | null>(null);
    const uploadAvatarMutation = useUploadAvatar();

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];  // Only take the first file
            const reader = new FileReader();

            reader.onload = () => {
                setAvatarImage({
                    id: 1,
                    src: reader.result as string,
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                    rotation: 0,
                    croppedAreaPixels: { x: 0, y: 0, width: 0, height: 0 },
                });
            };

            reader.onerror = () => console.error("Error reading file:", reader.error);
            reader.readAsDataURL(file);
        }
    };

    const onSetCrop = (crop: Point) => {
        setAvatarImage((prev) => {
            if (!prev) return null;
            return { ...prev, crop };
        });
    }

    const onSetZoom = (zoom: number) => {
        setAvatarImage((prev) => {
            if (!prev) return null;
            return { ...prev, zoom };
        });
    }

    const onSetRotation = (rotation: number) => {
        setAvatarImage((prev) => {
            if (!prev) return null;
            return { ...prev, rotation };
        });
    }

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setAvatarImage((prev) => {
            if (!prev) return null;
            return { ...prev, croppedAreaPixels };
        });
    }

    const updateAvatar = async () => {
        if (!avatarImage) return;

        const img = avatarImage;
        const src = img.src;
        if (!src) {
            return;
        }

        const croppedAreaPixels = img.croppedAreaPixels;
        const rotation = img.rotation || 0;

        try {
            const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
            if (!blob) return;

            const avatarBlob: Blob = blob;

            toast.promise(uploadAvatarMutation.mutateAsync({ imgBlob: avatarBlob }), {
                loading: "Uploading avatar...",
                success: "Avatar uploaded successfully!",
                error: "Failed to upload avatar."
            });

        } catch (error) {
            console.error("Error processing image:", error);
        }
    }

    if (!avatarImage) {
        return (
            <div className="p-4 grid w-[90vw] xs:w-full items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" className="cursor-pointer" onChange={onSelectFile} />
            </div>
        );
    }

    return (
        <div className="w-[90vw] min-h-[85vh] max-h-screen lg:w-[70vw] relative">
            {/* <p className="">Change Image</p> */}
            <div className="relative bg-primary text-white rounded-md rounded-bl-none rounded-br-none cursor-pointer h-8 hover:opacity-95">
                <Icon name="upload" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-[2px] select-none" />
                <Input id="editAvatar" type="file" className="w-full h-full opacity-0 cursor-pointer" onChange={onSelectFile} />
            </div>

            <div className="relative h-[80%] sm:h-[80%] rounded-md rounded-tl-none rounded-tr-none overflow-hidden">
                <Cropper
                    image={avatarImage?.src}
                    crop={avatarImage?.crop || { x: 0, y: 0 }}
                    zoom={avatarImage?.zoom || 1}
                    rotation={avatarImage?.rotation || 0}
                    aspect={1 / 1}
                    onCropChange={onSetCrop}
                    onZoomChange={onSetZoom}
                    onRotationChange={onSetRotation}
                    onCropComplete={onCropComplete}
                    classes={{ containerClassName: "card-color" }}
                />
            </div>

            <EditPanel
                imageSrc={avatarImage?.src}
                crop={avatarImage?.crop}
                zoom={avatarImage?.zoom}
                rotation={avatarImage?.rotation}
                onCropChange={onSetCrop}
                onZoomChange={onSetZoom}
                onRotationChange={onSetRotation}
                onCropComplete={onCropComplete}
                containerClassName="flex flex-col sm:flex-row sm:items-center px-4 py-4"
            />

            <div className="flex flex-row-reverse gap-2">
                <Button onClick={updateAvatar}>Save</Button>
                <Button onClick={() => setIsOpen(false)} variant={"secondary"}>Close</Button>
            </div>
        </div >
    );
}