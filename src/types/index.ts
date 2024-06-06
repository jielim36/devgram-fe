export * from './User';
export * from './Post';
export * from './Story';
export * from './Comment';

export type ResponseBody<T> = {
    code: number;
    message: string;
    data: T;
};