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
    DropdownMenuSeparator,
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
            title: "Profile",
            icon: <Icon name="user-round" />,
            href: `/profile/${user?.id}`,
        }
    ]

    const stories = [
        {
            id: 1,
            name: "Grace Ng",
            avatar: user?.avatar_url,
            stories: [
                {
                    id: 1,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
                {
                    id: 2,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
                {
                    id: 3,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
            ],
        },
        {
            id: 2,
            name: "Lim Yee Jie",
            avatar: user?.avatar_url,
            stories: [
                {
                    id: 1,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
                {
                    id: 2,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
                {
                    id: 3,
                    src: "https://images.unsplash.com/photo-1593642532452-3b4f3b3a0e6b",
                    time: "2h",
                },
            ],
        },
    ]

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
            <Card className="absolute w-screen z-10 flex flex-row justify-end xs:justify-between items-center h-16 rounded-none px-2 xs:px-8">
                <AppTitle className="flex-none text-white hidden md:block" defaultColor={theme === 'light'} isBold={true} />
                <div className="hidden xs:block relative w-96">
                    <Icon name="search" className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                </div>
                <div className="flex gap-4 items-center">
                    <ImageCropContainer trigger={
                        <Icon name="plus" color="white" />
                    } />
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
                    <Accordion type="single" defaultValue="stories" collapsible className="w-full px-4 hidden lg:block">
                        <Separator />
                        <AccordionItem value="stories">
                            <AccordionTrigger>Stories</AccordionTrigger>
                            <AccordionContent>
                                <ul>
                                    {stories.map((story) => (
                                        <li key={story.id}>
                                            <div className="flex flex-row items-center gap-3 py-1 rounded-md hover:bg-accent hover:text-accent-foreground">
                                                <AvatarContainer avatar_url={story.avatar} hasStory={story.stories.length > 0} />
                                                <span>{story.name}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

export function NavigationMenuComponent({ user }: { user: User }) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <DotContainer children={
                        <NavigationMenuTrigger onClick={() => {
                            window.location.href = '/chat';
                        }}>
                            <Icon name="send" />
                        </NavigationMenuTrigger>
                    }
                    />
                    <NavigationMenuContent>
                        <ul className="flex flex-col w-80">
                            <ListItem href="/chat/1001">
                                <div className="flex flex-row gap-2">
                                    <Avatar>
                                        <AvatarFallback className="bg-accent">G</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">Grace Ng</span>
                                        <span className="text-muted-foreground line-clamp-1">Hey, are you therefgsdfg fgsdfg fdgsdf gfdgdfgdfg fgsfg?</span>
                                    </div>
                                </div>
                            </ListItem>
                            <ListItem href="/chat/1001">
                                <div className="flex flex-row gap-2">
                                    <Avatar>
                                        <AvatarFallback className="bg-accent">G</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">Grace Ng</span>
                                        <span className="text-muted-foreground line-clamp-1">Hey, are you therefgsdfg fgsdfg fdgsdf gfdgdfgdfg fgsfg?</span>
                                    </div>
                                </div>
                            </ListItem>
                            <ListItem href="/chat/1001">
                                <div className="flex flex-row gap-2">
                                    <Avatar>
                                        <AvatarFallback className="bg-accent">G</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">Grace Ng</span>
                                        <span className="text-muted-foreground line-clamp-1">Hey, are you therefgsdfg fgsdfg fdgsdf gfdgdfgdfg fgsfg?</span>
                                    </div>
                                </div>
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <DotContainer children={
                        <NavigationMenuTrigger>
                            <Icon name="inbox" />
                        </NavigationMenuTrigger>
                    }
                    />
                    <NavigationMenuContent>
                        <ul className="flex flex-col w-80">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
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


    const handleChangeTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const handleLogout = () => {
        toast.promise(logoutMutation.mutateAsync(), {
            loading: "Logging out",
            success: "Logged out",
            error: "Error logging out"
        });
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
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Devgram Premium</DropdownMenuItem>
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