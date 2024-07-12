import { z } from 'zod';

export const signupSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6, { message: 'Your password must be at least 6 characters long' }),
    confirmPassword: z.string().min(6, { message: `The passwords don't match` }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: `The passwords don't match`,
        path: ['confirmPassword'],
      });
    }
  });

export type SignupSchema = z.infer<typeof signupSchema>;
