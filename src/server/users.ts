'use server';

import { auth } from "@/lib/auth";

export const signIn = async (form: {
    email: string;
    password: string;
}) => {
    try {
        const res = await auth.api.signInEmail({
            body: {
                email: form.email,
                password: form.password,
            }
        })
        return { success: true, message: "Sign In Successful!"};
    } catch (error) {
        return { success: false, message: "Invalid Email or Password"};
    }
}

export const signUp = async (form: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image?: string;
}) => {
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: form.email,
                password: form.password,
                name: `${form.firstName} ${form.lastName}`,
                image: form.image || "",
            },
        });
        return { success: true, message: "Account Created!" };
    } catch (error) {
        return { success: false, message: "Sign Up failed!" };
    }
};