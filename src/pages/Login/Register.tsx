import AppTitle from "@/components/appTitle/AppTitle";
import ThemeToggleButton from "@/components/ThemeToggleButton/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/utils/ThemeProvider";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { RegisterRequest, ResponseBody } from "@/types";
import { useState } from "react";
import Icon from "@/components/Icon/Icon";


const Register = () => {

    const { theme } = useTheme();

    const handleJumpToLoginPage = () => {
        window.location.href = "/login";
    }

    return (
        <>
            <ThemeToggleButton className="absolute top-1 right-1" />
            <div onClick={handleJumpToLoginPage} className="absolute top-1 left-1 cursor-pointer">
                <Icon name="arrow-left" className="text-white" />
            </div>
            <div className={`w-screen h-screen flex justify-center items-center ${theme === 'light' ? "bg-gradient" : "bg-gradient-dark"}`}>
                <Card className="w-[300px] sm:w-[400px] flex flex-col p-5 gap-4">
                    <AppTitle className={"text-center"} defaultColor={false} />
                    <RegisterForm />
                </Card>
            </div>
        </>
    );
}



export const userRegisterFormSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }).max(24, {
        message: "Username must be at most 24 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string()
        .min(4, {
            message: "Password must be at least 4 characters.",
        }).max(36, {
            message: "Password must be at most 36 characters.",
        }),
    confirmPassword: z.string()
        .min(4, {
            message: "Confirm password must be at least 4 characters.",
        })
        .max(36, {
            message: "Confirm password must be at most 36 characters.",
        }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
})

const RegisterForm = () => {

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const form = useForm<z.infer<typeof userRegisterFormSchema>>({
        resolver: zodResolver(userRegisterFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const useRegisterMutation = useRegister({
        onSuccess: (data) => {
            if (data?.data.token) {
                localStorage.setItem("token", data?.data.token);
                window.location.href = "/";
                toast("Welcome to Devgram! 🎉");
            }
        },
        onError: (error) => {
            const errorMessage = error?.response?.data as ResponseBody<string>;
            if (errorMessage?.data) {
                setErrorMessage(errorMessage?.data);
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    });

    function onSubmit(values: z.infer<typeof userRegisterFormSchema>) {
        const registerRequest: RegisterRequest = values;
        toast.promise(useRegisterMutation.mutateAsync(registerRequest), {
            loading: "Registering...",
            success: "Register success",
            error: "Register failed",
        });
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
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {errorMessage ?
                    (
                        <div className="text-red-500 text-xs">{errorMessage}</div>
                    )
                    :
                    (
                        <div className="opacity-0">EMPTY</div>
                    )
                }
                <Button type="submit" className="w-full">Register</Button>
            </form>
        </Form>
    )

}


export default Register;