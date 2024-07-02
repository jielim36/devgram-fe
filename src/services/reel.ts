import { Reel, ReelRequestBody, ResponseBody } from "@/types";
import axiosClient from "@/utils/axiosClient";

export const addReel = async (reel: ReelRequestBody): Promise<ResponseBody<boolean>> => {
    const response = await axiosClient.post('/reel', reel);
    return response.data;
}

export const getPopularReels = async (page: number): Promise<ResponseBody<Reel[]>> => {
    const response = await axiosClient.get(`/reel/popular/${page}`);
    return response.data;
}