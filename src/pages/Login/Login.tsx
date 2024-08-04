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
import { useLogin, useLogout } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { AuthenticationRequest } from "@/types";
import { useGetMe } from "@/hooks";
import axiosClient from "@/utils/axiosClient";
import { useEffect } from "react";
import { clearAppData, clearOAuthCookie, clearToken } from "@/utils/ClearAppData";

const Login = () => {

    const { theme } = useTheme();
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    // const getMeQuery = useGetMe();
    const useLogoutMutation = useLogout({
        onSuccess: () => { }
    });

    useEffect(() => {
        // clear data
        useLogoutMutation.mutate();
        clearAppData();
    }, []);

    const handleLogin = (provider: string) => {
        clearToken();
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
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string()
        .min(1, {
            message: "Password is required.",
        }),
});

const LoginForm = () => {

    const useLoginMutation = useLogin({
        onSuccess: (data) => {
            console.log(data);
            // save token in localStorage
            if (!data?.data.token) return;
            localStorage.setItem("token", data?.data.token);
            // redirect to home page
            window.location.href = "/";
        }
    });

    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: "jielim@gmail.com",
            password: "123",
        },
    })

    function onSubmit(values: z.infer<typeof userFormSchema>) {
        const authRequest: AuthenticationRequest = values;
        toast.promise(useLoginMutation.mutateAsync(authRequest), {
            loading: "Logging in...",
            success: "Login success",
            error: "Login failed",
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
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