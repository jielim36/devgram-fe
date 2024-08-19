import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import InputWithEmoji from "../InputWithEmoji/InputWithEmoji";
import { useAddReel } from "@/hooks/useReel";
import toast from "react-hot-toast";
import { ReelRequestBody } from "@/types";
import { useAuth } from "@/utils/AuthProvider";
import { ReelPlatformCheck } from "@/utils/ReelPlatformUrlUtils";



type ReelUploaderProps = {
    trigger: React.ReactNode;
}

const FormSchema = z.object({
    reelLink: z.string()
        .refine((val) => val.startsWith("https://www.youtube.com/shorts/"), {
            message: "Reel Link must start with 'https://www.youtube.com/shorts/'",
        }),
    description: z.string().optional(),
})

const ReelUploader: React.FC<ReelUploaderProps> = ({
    trigger
}) => {

    const [open, setOpen] = useState(false)
    const { user } = useAuth();
    const addReelMutation = useAddReel({
        onSuccess: () => {
            setOpen(false)
        },
        onError: () => {
        }
    });
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            reelLink: "",
            description: "",
        },
    });

    const [description, setDescription] = useState("")

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        const platform: string | undefined = ReelPlatformCheck(data.reelLink);
        if (platform === undefined) {
            toast.error("Invalid platform");
            return;
        }
        if (!user?.id) {
            toast.error("User not found");
            return;
        }

        const reelRequestBody: ReelRequestBody = {
            description: description,
            reel_url: data.reelLink,
            platform: platform,
            user_id: user?.id
        }

        toast.promise(addReelMutation.mutateAsync({ reelRequestBody: reelRequestBody }), {
            loading: "Uploading reel...",
            success: "Reel uploaded successfully",
            error: "Failed to upload reel",
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="min-w-[300px] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Upload Reel Link</DialogTitle>
                    <DialogDescription>
                        Due to database storage reasons, we currently do not accept uploaded videos, but instead use third-party video demonstration reels
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="reelLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Paste youtube short link" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <InputWithEmoji
                                            content={description}
                                            setContent={setDescription}
                                            textAreaClassName="max-h-[40vh]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Upload</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default ReelUploader;