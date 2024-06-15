import toast, { Toaster } from "react-hot-toast";
import "@/style/color.css";
import { UseQueryResult } from "@tanstack/react-query";
import { Card } from "../ui/card";

type ToasterProps = {
    theme: "light" | "dark" | "system";
}

const CustomToaster: React.FC<ToasterProps> = ({
    theme,
}) => {

    const darkTheme = "card-color";

    return (
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
                className: "card-color"
            }}
        />
    );

}

type ToastProps = {
    promiseFnc: (...args: any[]) => Promise<any>;
    args?: any[];
    message?: {
        loading?: string;
        success?: string;
        error?: string;
    };
};

export const PromiseToast = ({
    promiseFnc,
    args = [],
    message = {
        loading: "Loading",
        success: "Success",
        error: "Error"
    },
}: ToastProps) => {
    const promise = promiseFnc(...args);
    toast.promise(promise, {
        loading: message.loading || "Loading",
        success: message.success || "Success",
        error: message.error || "Error",
    });
};

type CustomQueryToastProps = {
    request: UseQueryResult<any, any>;
    message?: {
        loading?: string;
        success?: string;
        error?: string;
    };
}

export const CustomQueryToast = ({
    request,
    message = {
        loading: "Loading",
        success: "Success",
        error: "Error"
    },
}: CustomQueryToastProps) => {

    const { isPending, isError, isSuccess } = request;

    const icon = isPending ? "🕒" : isSuccess ? "✅" : isSuccess ? "✅" : "🕒";
    const msg = isPending ? message.loading : isError ? message.error : isSuccess ? message.success : message.loading;

    const toastContainer = (
        <Card className="flex flex-row justify-center p-4">
            <span className="">{icon}</span>
            <span className="">{msg}</span>
        </Card>
    );

    if (isPending) {
        toast.loading(msg || "x");
    }
    // toast.custom(toastContainer);

}



export default CustomToaster;