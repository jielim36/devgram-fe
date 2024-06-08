export * from './User';
export * from './Post';
export * from './Story';
export * from './Comment';
export * from './Like';

export type ResponseBody<T> = {
    code: number;
    message: string;
    data: T;
};