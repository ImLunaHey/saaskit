import { z } from 'zod';

export const signinSchema = z.object({
  username: z.string(),
  password: z.string().min(6, { message: 'Your password must be at least 6 characters long' }),
});

export type SigninSchema = z.infer<typeof signinSchema>;
