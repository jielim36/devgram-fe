import { User } from "@/types/User";
import axiosClient from "@/utils/axiosClient";
import { ResponseBody } from "@/types";

export const addPost = async (userId: number, description: string, imgBlobArray: Blob[]): Promise<ResponseBody<boolean>> => {
    const formData = new FormData();
    formData.append("description", description);

    for (let i = 0; i < imgBlobArray.length; i++) {
        formData.append("files", imgBlobArray[i], `post${i}.jpeg`);
    }

    const response = await axiosClient.post(`http://localhost:8080/post/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;

}