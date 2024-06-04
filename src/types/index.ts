export * from './User';
export * from './Post';
export * from './Story';

export type ResponseBody<T> = {
    code: number;
    message: string;
    data: T;
};