export type AuthenticationRequest = {
    email: string;
    password: string;
}

export type AuthenticationResponse = {
    token: string;
}

export type RegisterRequest = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}