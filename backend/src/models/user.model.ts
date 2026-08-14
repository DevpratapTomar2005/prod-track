
export type UserRegisterBody = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}
export type UserLoginBody = {
    email: string;
    password: string;
}

export type CookieOptions = {
    httpOnly:boolean,
    secure:boolean,
    sameSite: "lax" | "strict" | "none",
    maxAge:number
}