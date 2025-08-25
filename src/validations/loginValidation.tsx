import * as z from "zod";
export type LoginFormData = z.infer<typeof loginValidation>;

export const loginValidation = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
