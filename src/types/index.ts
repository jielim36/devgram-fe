export * from './User';

export type ResponseBody<T> = {
    code: number;
    message: string;
    data: T;
};