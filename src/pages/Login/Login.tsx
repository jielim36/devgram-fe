import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import AppTitle from "@/components/appTitle/AppTitle";
import "@/style/color.css"
import GithubLightIcon from "@/assets/icon/github-light.svg";
import GithubDarkIcon from "@/assets/icon/github-dark.svg";
import GoogleIcon from "@/assets/icon/google.svg";
import ThemeToggleButton from "@/components/ThemeToggleButton/ThemeToggleButton";
import { useTheme } from "@/utils/ThemeProvider";

const Login = () => {

    const { theme } = useTheme();
    const serverUrl = import.meta.env.VITE_SERVER_URL;

    const handleLogin = (provider: string) => {
        window.location.href = `${serverUrl}/oauth2/authorization/${provider}`;
    };

    const handleGoToRegisterPage = () => {
        window.location.href = "/register";
    }

    return (
        <>
            <ThemeToggleButton className="absolute top-1 right-1" />
            <div className={`w-screen h-screen flex justify-center items-center ${theme === 'light' ? "bg-gradient" : "bg-gradient-dark"}`}>
                <Card className="w-[300px] sm:w-[400px] flex flex-col p-5 gap-4">
                    <AppTitle className={"text-center"} defaultColor={false} />
                    <LoginForm />
                    <p className="text-end text-sm leading-none text-muted-foreground pr-2 cursor-pointer hover:underline" onClick={handleGoToRegisterPage}>Sign up for an account</p>
                    <p className="text-center text-sm leading-none pt-4 text-muted-foreground select-none">Login with third-party</p>
                    <div className="flex flex-row gap-4 justify-center">
                        <Button variant="outline" size="icon" onClick={() => handleLogin('github')}>
                            <img src={theme === 'light' ? GithubLightIcon : GithubDarkIcon} alt="" width={32} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleLogin('google')}>
                            <img src={GoogleIcon} alt="" width={32} />
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );

}

export const userFormSchema = z.object({
    username: z.string().min(5, {
        message: "Username must be at least 5 characters.",
    }).max(24, {
        message: "Username must be at most 24 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(36, {
        message: "Password must be at most 36 characters.",
    }),
});

const LoginForm = () => {

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof userFormSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </Form>
    )

}

export default Login;