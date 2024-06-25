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

export const SettingSheet = () => {
    const [isOpen, setOpen] = React.useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="flex-none">
                    <Icon name="settings" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Privacy</SheetTitle>
                    <SheetDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </SheetDescription>

                </SheetHeader>
                <div className="py-2">
                    <PrivacySettings setOpen={setOpen} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export const SettingDrawer = () => {

    const [isOpen, setOpen] = React.useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost">
                    <Icon name="settings" />
                </Button>
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

const VisibilityDayArr = ["1", "3", "7", "14", "30", "90", "0"] as const;

const privacySettingsFormSchema = z.object({
    canSeePostFollower: z.boolean(),
    canSeePostFollowing: z.boolean(),
    canSeePostFriend: z.boolean(),
    postVisibilityDurationFollower: z.enum(VisibilityDayArr),
    postVisibilityDurationFollowing: z.enum(VisibilityDayArr),
    postVisibilityDurationFriend: z.enum(VisibilityDayArr),
});

const PrivacySettings = ({ setOpen }: { setOpen: (isOpen: boolean) => void }) => {
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
    const postVisibilityDurationFollower = form.watch("postVisibilityDurationFollower");
    const postVisibilityDurationFollowing = form.watch("postVisibilityDurationFollowing");
    const postVisibilityDurationFriend = form.watch("postVisibilityDurationFriend");

    useEffect(() => {

    }, [isAllowedFollower, isAllowedFollowing, isAllowedFriend, postVisibilityDurationFollower, postVisibilityDurationFollowing, postVisibilityDurationFriend]);

    const handleReset = () => {
        form.reset({
            canSeePostFollower: true,
            canSeePostFollowing: true,
            canSeePostFriend: true,
            postVisibilityDurationFollower: "0",
            postVisibilityDurationFollowing: "0",
            postVisibilityDurationFriend: "0",
        });
    }

    function onSubmit(values: z.infer<typeof privacySettingsFormSchema>) {
        console.log(values);
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
                                <FormLabel className="h-fit mt-2">Follower</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="canSeePostFollowing"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">Following</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="canSeePostFriend"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel className="h-fit mt-2">Friend</FormLabel>
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
