import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Switch } from "@/components/ui/switch"
import React, { useEffect } from "react";
import { PrivacySetting, VisibilityDurationType } from "@/types";
import { useAuth } from "@/utils/AuthProvider";
import { useGetPrivacySettingByUserId, useUpdatePrivacySettingByUserId } from "@/hooks";
import toast from "react-hot-toast";

type SettingProps = {
    trigger?: React.ReactNode;
}

export const SettingSheet: React.FC<SettingProps> = ({
    trigger
}) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {trigger ? trigger :
                    <Button variant="ghost" className="flex-none">
                        <Icon name="settings" />
                    </Button>
                }
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Privacy</SheetTitle>
                    <SheetDescription>
                        In the privacy settings, you can control the visibility of your profile page to others, enhancing your control over who can view your information and activities.
                    </SheetDescription>

                </SheetHeader>
                <div className="py-4">
                    <PrivacySettings setOpen={setOpen} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export const SettingDrawer: React.FC<SettingProps> = ({
    trigger
}) => {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {trigger ? trigger :
                    <Button variant="ghost">
                        <Icon name="settings" />
                    </Button>
                }
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Privacy Settings</DrawerTitle>
                    <DrawerClose />
                </DrawerHeader>
                <div className="px-4 xs:px-6 pb-4 max-h-[75vh] overflow-auto">
                    <PrivacySettings setOpen={setOpen} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

type VisibilityDurationStr = "1" | "3" | "7" | "14" | "30" | "90" | "0";
const VisibilityDayArr = ["1", "3", "7", "14", "30", "90", "0"] as const;

const privacySettingsFormSchema = z.object({
    canSeePostFollower: z.boolean(),
    canSeePostFollowing: z.boolean(),
    canSeePostFriend: z.boolean(),
    canSeePostAll: z.boolean(),
    postVisibilityDurationFollower: z.enum(VisibilityDayArr),
    postVisibilityDurationFollowing: z.enum(VisibilityDayArr),
    postVisibilityDurationFriend: z.enum(VisibilityDayArr),
    postVisibilityDurationAll: z.enum(VisibilityDayArr),
});

const PrivacySettings = ({ setOpen }: { setOpen: (isOpen: boolean) => void }) => {
    const { user } = useAuth();
    const form = useForm<z.infer<typeof privacySettingsFormSchema>>({
        resolver: zodResolver(privacySettingsFormSchema),
        defaultValues: {
            canSeePostFollower: true,
            canSeePostFollowing: true,
            canSeePostFriend: true,
            postVisibilityDurationFollower: "0",
            postVisibilityDurationFollowing: "0",
            postVisibilityDurationFriend: "0",
        },
    })

    const isAllowedFollower = form.watch("canSeePostFollower");
    const isAllowedFollowing = form.watch("canSeePostFollowing");
    const isAllowedFriend = form.watch("canSeePostFriend");
    const isAllowedAll = form.watch("canSeePostAll");
    const postVisibilityDurationFollower = form.watch("postVisibilityDurationFollower");
    const postVisibilityDurationFollowing = form.watch("postVisibilityDurationFollowing");
    const postVisibilityDurationFriend = form.watch("postVisibilityDurationFriend");
    const postVisibilityDurationAll = form.watch("postVisibilityDurationAll");
    const { data: privacySetting } = useGetPrivacySettingByUserId({
        userId: user?.id || 0,
        enabled: !!user?.id
    });
    const updatePrivacySettingMutation = useUpdatePrivacySettingByUserId({
        onSuccess: () => {
            setOpen(false);
        },
        onError: () => { }
    });

    useEffect(() => {
        if (isAllowedFollower && isAllowedFollowing) {
            form.setValue("canSeePostFriend", true);
        }
    }, [isAllowedFollower, isAllowedFollowing]);

    useEffect(() => {
        if (!isAllowedFriend && isAllowedFollower && isAllowedFollowing) {
            form.setValue("canSeePostFriend", false);
            form.setValue("canSeePostFollower", false);
            form.setValue("canSeePostFollowing", false);
        }
    }, [isAllowedFriend]);

    useEffect(() => {
        if (privacySetting) {
            const { canSeePostFollower, canSeePostFollowing, canSeePostFriend, postVisibilityDurationFollower, postVisibilityDurationFollowing, postVisibilityDurationFriend } = privacySetting.data;
            form.reset({
                canSeePostFollower,
                canSeePostFollowing,
                canSeePostFriend,
                postVisibilityDurationFollower: postVisibilityDurationFollower.toString() as VisibilityDurationStr,
                postVisibilityDurationFollowing: postVisibilityDurationFollowing.toString() as VisibilityDurationStr,
                postVisibilityDurationFriend: postVisibilityDurationFriend.toString() as VisibilityDurationStr,
            });
        }
    }, [privacySetting])

    useEffect(() => {
        if (isAllowedAll) {
            form.setValue("canSeePostFollower", true);
            form.setValue("canSeePostFollowing", true);
            form.setValue("canSeePostFriend", true);
        }
    }, [isAllowedAll]);

    const handleReset = () => {
        form.reset({
            canSeePostFollower: true,
            canSeePostFollowing: true,
            canSeePostFriend: true,
            canSeePostAll: true,
            postVisibilityDurationFollower: "0",
            postVisibilityDurationFollowing: "0",
            postVisibilityDurationFriend: "0",
            postVisibilityDurationAll: "0",
        });
    }

    function onSubmit(values: z.infer<typeof privacySettingsFormSchema>) {
        if (!user?.id) return;
        const privacySetting: PrivacySetting = {
            userId: user?.id,
            canSeePostFollower: values.canSeePostFollower,
            canSeePostFollowing: values.canSeePostFollowing,
            canSeePostFriend: values.canSeePostFriend,
            canSeePostAll: values.canSeePostAll,
            postVisibilityDurationFollower: Number(values.postVisibilityDurationFollower) as VisibilityDurationType,
            postVisibilityDurationFollowing: Number(values.postVisibilityDurationFollowing) as VisibilityDurationType,
            postVisibilityDurationFriend: Number(values.postVisibilityDurationFriend) as VisibilityDurationType,
            postVisibilityDurationAll: Number(values.postVisibilityDurationAll) as VisibilityDurationType,
        }

        toast.promise(updatePrivacySettingMutation.mutateAsync({ userId: user.id, privacySetting }), {
            loading: "Saving...",
            success: "Privacy settings updated!",
            error: "Failed to update privacy settings",
        });
    }

    if (!privacySetting?.data) {
        return <Icon name="loader-circle" className="animate-spin h-6 w-6 mx-auto" />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                {/* Entity visibility settings */}
                <div className="flex flex-col gap-4">
                    <p className="text-md font-semibold text-muted-foreground">Who can see your post</p>

                    <FormField
                        control={form.control}
                        name="canSeePostFollower"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">Only Follower</FormLabel>
                                <FormControl>
                                    <Switch
                                        disabled={isAllowedAll || isAllowedFriend}
                                        className=""
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="canSeePostFollowing"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">Only Following</FormLabel>
                                <FormControl>
                                    <Switch
                                        disabled={isAllowedAll || isAllowedFriend}
                                        className=""
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="canSeePostFriend"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">Only Friend</FormLabel>
                                <FormControl>
                                    <Switch
                                        disabled={isAllowedAll}
                                        className=""
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="canSeePostAll"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">All</FormLabel>
                                <FormControl>
                                    <Switch
                                        className=""
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-md font-semibold text-muted-foreground">How long they can see</p>

                    <FormField
                        control={form.control}
                        name="postVisibilityDurationFollower"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel className={`mt-2 ${isAllowedFollower ? "" : "text-muted-foreground"}`}>Follower</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={!isAllowedFollower}
                                >
                                    <SelectTrigger className="w-1/3">
                                        <SelectValue placeholder="Select date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VisibilityDayArr.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day === "0" ? "Forever" : `${day} days`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postVisibilityDurationFollowing"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel className={`mt-2 ${isAllowedFollowing ? "" : "text-muted-foreground"}`}>Following</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={!isAllowedFollowing}
                                >
                                    <SelectTrigger className="w-1/3">
                                        <SelectValue placeholder="Select date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VisibilityDayArr.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day === "0" ? "Forever" : `${day} days`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postVisibilityDurationFriend"
                        render={({ field }) => (
                            <FormItem className="flex justify-between items-center">
                                <FormLabel className={`mt-2 ${isAllowedFriend ? "" : "text-muted-foreground"}`}>Friend</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={!isAllowedFriend}
                                >
                                    <SelectTrigger className="w-1/3">
                                        <SelectValue placeholder="Select date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VisibilityDayArr.map((day) => (
                                            <SelectItem key={day} value={day}>
                                                {day === "0" ? "Forever" : `${day} days`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postVisibilityDurationAll"
                        render={({ field }) => (
                            <FormItem className="mt-2">
                                <div className="flex justify-between items-center">
                                    <FormLabel className={`mt-2 ${isAllowedAll ? "" : "text-muted-foreground"}`}>All</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                        disabled={!isAllowedAll}
                                    >
                                        <SelectTrigger className="w-1/3">
                                            <SelectValue placeholder="Select date" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {VisibilityDayArr.map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day === "0" ? "Forever" : `${day} days`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormDescription className="text-muted-foreground text-xs">Visibility duration for the user not your following and follower.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
                    <div className="flex gap-1">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
