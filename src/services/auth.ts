import { ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const logout = async (): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post("/logout");
    return response.data;
}