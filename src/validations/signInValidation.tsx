import * as z from "zod";

export type SignInFormData = z.infer<typeof signInValidation>;
export const signInValidation = z.object({
  name: z.string().min(1, { message: "Username is required" }),
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
