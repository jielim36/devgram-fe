export * from './User';
export * from './Post';
export * from './Story';
export * from './Comment';
export * from './Like';
export * from "./Follow";
export * from "./PrivacySetting";

export type ResponseBody<T> = {
    code: number;
    message: string;
    data: T;
};