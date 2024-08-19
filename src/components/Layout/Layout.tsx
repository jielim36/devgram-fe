import * as React from "react"
import { Outlet, Link, useLocation } from "react-router-dom";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils"
// import Icons from "@/components/Icon/Icon"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar"
import { Input } from "../ui/input";
import AppTitle from "../appTitle/AppTitle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "../ui/switch";
import { useTheme } from "@/utils/ThemeProvider";
import { Label } from "../ui/label";
import DotContainer from "../Dot/Dot";
import { User } from "@/types";
import { Separator } from "../ui/separator";
import "@/style/color.css";
import AvatarContainer from "../AvatarContainer/AvatarContainer";
import ImageCropContainer from "../ImageCrop/ImageCrop";
import { useAuth } from "@/utils/AuthProvider";
import { useLogout } from "@/hooks/useAuth";
import Icon from "../Icon/Icon";
import PostSkeleton from "../Suspense/PostSkeleton";
import UnauthorizedPage from "@/pages/InvalidPages/UnauthorizedPage";
import toast from "react-hot-toast";
import SkeletonPage from "../Suspense/SkeletonPage";
import { Button } from "../ui/button";
import ReelUploader from "../ReelsUploader/ReelsUploader";
import { UserList } from "@/pages/chat/Chat";
import { useChatting } from "@/utils/ChattingProvider";
import { EditProfileDialog, EditProfileDrawer } from "@/pages/Profile/EditProfile";
import { SettingDrawer, SettingSheet } from "@/pages/Profile/Settings";
import AppLogo from "@/assets/devgram-icon.svg";
import { clearAppData } from "@/utils/ClearAppData";
import { useGetUserInfoByUserId } from "@/hooks";
import { MessageCircleIcon } from "lucide-react";

type LeftSideNavigationItem = {
    title: string;
    icon: React.ReactNode;
    href: string;
}


const Layout = () => {

    const location = useLocation();
    const { theme } = useTheme();
    const { user } = useAuth();
    const LeftSideNavigationItems: LeftSideNavigationItem[] = [
        {
            title: "Home",
            icon: <Icon name="home" />,
            href: "/",
        },
        {
            title: "Reels",
            icon: <Icon name="clapperboard" />,
            href: "/reels",
        },
        {
            title: "Following",
            icon: <Icon name="users-round" />,
            href: "/following",
        },
        {
            title: "Search",
            icon: <Icon name="search" />,
            href: "/search",
        },
        {
            title: "Profile",
            icon: <Icon name="user-round" />,
            href: `/profile/${user?.id}`,
        }
    ]

    const handleBackToHome = () => {
        window.location.href = '/';
    }

    if (!user) {
        return (
            <div className="h-screen w-screen flex justify-center items-center">
                <Icon name="loader-circle" className="animate-spin text-muted-foreground h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen h-full w-full flex flex-col">
            {/* Top Navigation */}
            <Card className="absolute w-screen z-10 flex flex-row justify-between items-center h-16 rounded-none px-2 xs:px-8 rounded-none">
                <AppTitle className="flex-none text-white hidden xs:block" defaultColor={theme === 'light'} isBold={true} />
                {/* <img src={AppLogo} alt="Devgram Logo" className="flex-none h-[90%] xs:hidden cursor-pointer" onClick={handleBackToHome} /> */}
                <MessageCircleIcon className="ml-1 flex-none h-[90%] xs:hidden cursor-pointer" onClick={handleBackToHome} height={40} width={40} />
                <div className="flex gap-4 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="bg-gradient py-2 px-4 rounded-sm hover:scale-110 transition duration-300 ease-in-out">
                            <Icon name="plus" color="white" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-fit w-fit px-2 flex flex-col">
                            <DropdownMenuLabel>Upload</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ImageCropContainer trigger={
                                <Button variant={"ghost"} className="font-normal">Post</Button>
                            } />
                            <ReelUploader trigger={
                                <Button variant={"ghost"} className="font-normal">Reel</Button>
                            } />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <NavigationMenuComponent user={user} />
                    <div className="">
                        <ProfileMenu user={user} />
                    </div>
                </div>
            </Card>

            <div className="w-screen h-screen flex flex-col xs:flex-row pt-16">
                {/* Side Navigation */}
                <Card className="w-16 lg:w-64 h-full rounded-none py-4 hidden xs:block">
                    <ul className="flex flex-col gap-3 items-center lg:items-start">
                        {LeftSideNavigationItems.map((item) => (
                            <li key={item.title} className="w-full">
                                <Link to={item.href} className={`flex flex-row items-center gap-4 p-4 rounded-md hover:bg-accent hover:text-accent-foreground ${location.pathname === item.href ? "font-bold" : ""}`}>
                                    {item.icon}
                                    <span className="hidden lg:block">{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>


                {/* Content */}
                <React.Suspense fallback={<SkeletonPage />}>
                    <div className="relative w-full h-full overflow-y-auto py-8">
                        <Outlet />
                    </div>
                </React.Suspense>

                {/* Mobile bottom navigate */}
                <Card className="h-16 xs:hidden fixed left-0 bottom-0 w-screen">
                    <ul className="flex flex-row justify-between items-center">
                        {LeftSideNavigationItems.map((item) => (
                            <li key={item.title}>
                                <Link to={item.href} className={`flex flex-row items-center gap-4 p-4 rounded-md hover:bg-accent hover:text-accent-foreground ${location.pathname === item.href ? "font-bold" : ""}`}>
                                    {item.icon}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    )
}

export function NavigationMenuComponent({ user }: { user: User }) {
    const { chats: chatRooms } = useChatting();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <DotContainer
                        children={
                            <NavigationMenuTrigger
                                onClick={() => {
                                    window.location.href = '/chat';
                                }}
                            >
                                <Icon name="send" />
                            </NavigationMenuTrigger>
                        }
                        hasDot={chatRooms?.length > 0 && chatRooms.filter((chat) => chat?.unread_count && chat?.unread_count > 0).length > 0}
                    />
                    <NavigationMenuContent>
                        {/* Chat Listing */}
                        <UserList me={user} userId={-1} chatRooms={chatRooms} className="w-80 h-80" />
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <div className="text-sm leading-snug">
                        {children}
                    </div>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const ProfileMenu = ({ user }: { user: User }) => {

    const { theme, setTheme } = useTheme();
    const logoutMutation = useLogout({
        onSuccess: () => {
            window.location.href = '/login';
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const { data: userInfoData } = useGetUserInfoByUserId(user.id);


    const handleChangeTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const handleLogout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.promise(logoutMutation.mutateAsync(), {
                loading: "Logging out",
                success: "Logged out",
                error: "Error logging out"
            });

            return;
        }
        clearAppData();
        window.location.href = '/login';
    }

    const handleJumpProfile = () => {
        window.location.href = `/profile/${user.id}`;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-0">
                <AvatarContainer avatar_url={user.avatar_url} hasStory={false} />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={3} align="end" className=" w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleJumpProfile}>Profile</DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        Settings
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {/* Edit Profile settings */}
                            {/* Desktop */}
                            <div className="hidden md:block">
                                <EditProfileDialog
                                    user={user}
                                    userInfo={userInfoData?.data}
                                    trigger={
                                        <Button variant={"ghost"} className="w-full flex flex-row gap-1 justify-start items-center">
                                            <Icon name="user" />
                                            Edit Profile
                                        </Button>
                                    } />
                            </div>
                            {/* Mobile */}
                            <div className="md:hidden">
                                <EditProfileDrawer
                                    user={user}
                                    userInfo={userInfoData?.data}
                                    trigger={
                                        <Button variant={"ghost"} className="w-full flex flex-row gap-1  justify-start items-center">
                                            <Icon name="user" />
                                            Edit Profile
                                        </Button>
                                    } />
                            </div>

                            {/* Privacy Settings */}
                            {/* Desktop */}
                            <div className="hidden md:block">
                                <SettingSheet trigger={
                                    <Button variant={"ghost"} className="w-full flex flex-row gap-1  justify-start items-center">
                                        <Icon name="settings" />
                                        Privacy Settings
                                    </Button>
                                } />
                            </div>
                            {/* Mobile */}
                            <div className="md:hidden">
                                <SettingDrawer trigger={
                                    <Button variant={"ghost"} className="w-full flex flex-row gap-1  justify-start items-center">
                                        <Icon name="settings" />
                                        Privacy Settings
                                    </Button>
                                } />
                            </div>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <div className="p-2 flex flex-row items-center justify-between">
                    <Label htmlFor="theme-switcher">Dark mode</Label>
                    <Switch id="theme-switcher" checked={theme === 'dark'} onClick={handleChangeTheme} />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-row gap-2" onClick={handleLogout}>
                    <Icon name="log-out" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent >
        </DropdownMenu >
    );
}

export default Layout;