import { AuthenticationRequest, RegisterRequest, ResponseBody } from "@/types";
import { AuthenticationResponse } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const logout = async (): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post("/logout");
    return response.data;
}

export const login = async (authRequest: AuthenticationRequest): Promise<ResponseBody<AuthenticationResponse>> => {
    const response = await axiosClient.post("/login", authRequest);
    return response.data;
}

export const register = async (registerRequest: RegisterRequest): Promise<ResponseBody<AuthenticationResponse>> => {
    const response = await axiosClient.post("/register", registerRequest);
    return response.data;
}