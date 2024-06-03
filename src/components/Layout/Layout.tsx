import * as React from "react"
import { Outlet, Link } from "react-router-dom";
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
import ThemeToggleButton from "../ThemeToggleButton/ThemeToggleButton";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AppTitle from "../appTitle/AppTitle";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InboxIcon, PlusIcon, SearchIcon, SendIcon } from "lucide-react";
import { Switch } from "../ui/switch";
import { useTheme } from "@/utils/ThemeProvider";
import { Label } from "../ui/label";
import axiosClient from "@/utils/axiosClient";
import { useEffect, useState } from "react";
import { UserProps } from "@/types/EntityType";
import DotContainer from "../Dot/Dot";

const Layout = () => {

    const { theme } = useTheme();
    const [user, setUser] = useState<UserProps | null>(null);

    const fetchUser = async () => {
        try {
            const { data } = await axiosClient.get('/user/me');
            setUser(data);
            console.log(data);

            if (!data) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error(error);
            window.location.href = '/login';
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    if (!user) return null

    return (
        <>
            <Card className="flex flex-row justify-between items-center h-14 rounded-none px-8">
                <AppTitle className="flex-none text-white" defaultColor={theme === 'light'} />
                <div className="relative w-96">
                    <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                </div>
                <div className="flex gap-10">
                    <Button className="bg-gradient">
                        <PlusIcon color="white" />
                    </Button>
                    <NavigationMenuComponent user={user} />
                    <div className="px-6">
                        <ProfileMenu user={user} />
                    </div>
                </div>
            </Card>
            <Outlet />
        </>
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

export function NavigationMenuComponent({ user }: { user: UserProps }) {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <DotContainer children={
                        <NavigationMenuTrigger>
                            <SendIcon />
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
                            <InboxIcon />
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
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

const ProfileMenu = ({ user }: { user: UserProps }) => {

    const { theme, setTheme } = useTheme();

    const handleChangeTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-0">
                <Avatar className="select-none">
                    <AvatarImage src={user.avatar_url} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={3} align="end" className=" w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2 flex flex-row items-center justify-between">
                    <Label htmlFor="theme-switcher">Dark mode</Label>
                    <Switch id="theme-switcher" checked={theme === 'dark'} onClick={handleChangeTheme} />
                </div>
            </DropdownMenuContent >
        </DropdownMenu >
    );
}

export default Layout;