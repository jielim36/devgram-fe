import { login, logout, register } from "@/services";
import { useMutation } from "@tanstack/react-query";
import { RegisterResponseHandlerType, ResponseHandlerType } from ".";
import { AuthenticationRequest, AuthenticationResponse, RegisterRequest } from "@/types";

export const useLogout = ({ onSuccess, onError }: ResponseHandlerType<boolean>) => {
    return useMutation({
        mutationFn: async () => {
            return logout();
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useLogin = ({ onSuccess, onError }: ResponseHandlerType<AuthenticationResponse>) => {
    return useMutation({
        mutationFn: async (authRequest: AuthenticationRequest) => {
            return login(authRequest);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}

export const useRegister = ({ onSuccess, onError }: RegisterResponseHandlerType<AuthenticationResponse>) => {
    return useMutation({
        mutationFn: async (registerRequest: RegisterRequest) => {
            return register(registerRequest);
        },
        onSuccess: onSuccess,
        onError: onError
    });
}