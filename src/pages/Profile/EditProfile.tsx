import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { UpdateUserInfo, User, UserInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format, parse } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUpdateUserInfo } from "@/hooks";
import toast from "react-hot-toast";
import { useState } from "react";



type EditProfileProps = {
    user: User;
    userInfo?: UserInfo;
}

export const EditProfileDrawer: React.FC<EditProfileProps> = ({
    user,
    userInfo,
}) => {

    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild onClick={() => setOpen(true)}>
                <Button>
                    Edit Profile
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerClose />
                </DrawerHeader>
                <div className="px-4 xs:px-6 max-h-[75vh] overflow-auto">
                    <EditProfileForm
                        user={user}
                        userInfo={userInfo}
                        setOpen={setOpen}
                    />
                </div>
                <DrawerFooter>
                    {/* <button>Save</button> */}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export const EditProfileDialog: React.FC<EditProfileProps> = ({
    user,
    userInfo,
}) => {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="w-[500px] md:w-[700px] space-y-2">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="max-h-[70vh] overflow-auto px-3">
                    <EditProfileForm
                        user={user}
                        userInfo={userInfo}
                        setOpen={setOpen}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

const userInfoFormSchema = z.object({
    username: z.string()
        .min(3, {
            message: "Username must be at least 3 characters.",
        })
        .max(30, {
            message: "Username must be at most 30 characters.",
        }),
    bio: z.string()
        .max(1000, {
            message: "Bio must be at most 1000 characters.",
        }),
    birthday: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
});

const dateFormat = "yyyy-MM-dd"

type EditProfileFormProps = {
    setOpen: (open: boolean) => void;
} & EditProfileProps;

const EditProfileForm: React.FC<EditProfileFormProps> = ({
    user,
    userInfo,
    setOpen,
}) => {

    const updateUserInfoMutation = useUpdateUserInfo();

    const form = useForm<z.infer<typeof userInfoFormSchema>>({
        resolver: zodResolver(userInfoFormSchema),
        defaultValues: {
            username: user.username || "",
            bio: userInfo?.bio || "",
            birthday: userInfo?.birthday,
            gender: userInfo?.gender || undefined,
        },
    })

    const bioValue = form.watch("bio")

    function onSubmit(values: z.infer<typeof userInfoFormSchema>) {
        if (updateUserInfoMutation.isPending) return;

        const updateUserInfoJson: UpdateUserInfo = {
            username: values.username,
            userInfoEntity: {
                user_id: user.id,
                bio: values.bio,
                birthday: values.birthday,
                gender: values.gender,
            }
        }
        if (userInfo === updateUserInfoJson.userInfoEntity) {
            toast.error("No changes detected.")
            return;
        }

        toast.promise(updateUserInfoMutation.mutateAsync({ updateUserInfo: updateUserInfoJson }, {
            onSuccess: () => {
                setOpen(false);
            }
        }), {
            loading: "Updating profile...",
            success: "Profile updated successfully!",
            error: "Failed to update profile.",
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Username */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} autoFocus={false} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Date Picker */}
                <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(parse(field.value, dateFormat, new Date()), dateFormat)
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <Icon name="calendar" className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? parse(field.value, dateFormat, new Date()) : null}
                                        onSelect={(date: Date) => field.onChange(format(date, dateFormat))}
                                        disabled={(date: Date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Your date of birth is used to calculate your age.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Gender Selection */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="w-[240px]">
                                    <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="h-40 max-h-80"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className={bioValue.length > 1000 ? "text-red-500" : ""}>{bioValue?.length || 0}/1000 Characters</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save</Button>
            </form>
        </Form>
    );

}