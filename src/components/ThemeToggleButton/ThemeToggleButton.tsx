import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useTheme } from "@/utils/ThemeProvider"
import { Card } from "../ui/card"
import Icon from "../Icon/Icon"

function ThemeToggleButton({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme()

    return (
        <Tabs defaultValue={theme} className={`w-[104px] ${className}`}>
            <TabsList className="flex justify-between relative rounded-full">
                <Card
                    className={`absolute bottom-0 left-0 w-1/2 h-full transition-transform transform flex items-center justify-center
                    ${theme === 'light' ? 'translate-x-0' : 'translate-x-full'} rounded-full
                    `}
                >
                    {theme === 'light' ? <Icon name="sun" /> : <Icon name="moon" />}
                </Card>
                <TabsTrigger
                    value="light"
                    onClick={() => setTheme('light')}
                    className="rounded-full"
                >
                    <Icon name="sun" />
                </TabsTrigger>
                <TabsTrigger
                    value="dark"
                    onClick={() => setTheme('dark')}
                    className="rounded-full"
                >
                    <Icon name="moon" />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );

    // return (
    //     <DropdownMenu>
    //         <DropdownMenuTrigger asChild className={className}>
    //             <Button variant="outline" size="icon">
    //                 <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //                 <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //                 <span className="sr-only">Toggle theme</span>
    //             </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //             <DropdownMenuItem onClick={() => setTheme("light")}>
    //                 Light
    //             </DropdownMenuItem>
    //             <DropdownMenuItem onClick={() => setTheme("dark")}>
    //                 Dark
    //             </DropdownMenuItem>
    //             <DropdownMenuItem onClick={() => setTheme("system")}>
    //                 System
    //             </DropdownMenuItem>
    //         </DropdownMenuContent>
    //     </DropdownMenu>
    // )
}

export default ThemeToggleButton