import { logout } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { ResponseHandlerType } from ".";

export const useLogout = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async () => {
            return logout();
        },
        onSuccess: onSuccess,
        onError: onError
    });
}