'use server';

import { actionClient } from '@/lib/action-client';
import { signinSchema } from './schema';
import { returnValidationErrors } from 'next-safe-action';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { initializeLucia, verifyPassword } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { logAction } from '@/lib/audit-log';

export const signin = actionClient.schema(signinSchema).action(async ({ parsedInput: { username, password } }) => {
  const context = getRequestContext();
  const db = context.env.DATABASE;
  const lucia = initializeLucia(db);

  // check if user already exists
  const existingUser = await db
    .prepare('SELECT id, email, password_hash FROM user WHERE username = ?')
    .bind(username)
    .first<{
      id: string;
      email: string;
      password_hash: string;
    }>();
  if (!existingUser) {
    return returnValidationErrors(signinSchema, {
      username: {
        _errors: ['User not found'],
      },
    });
  }

  // check if password is correct
  const validPassword = await verifyPassword({
    password,
    hash: existingUser.password_hash,
  });
  if (!validPassword) {
    return returnValidationErrors(signinSchema, {
      password: {
        _errors: ['Incorrect password'],
      },
    });
  }

  const keys = [...headers().keys()];
  const values = [...headers().values()];
  console.info(Object.fromEntries(keys.map((_, i) => [keys[i], values[i]])));

  // create session
  const session = await lucia.createSession(existingUser.id, {
    created_at: Date.now().toString(),
    user_agent: headers().get('user-agent') ?? '',
    ip_address: headers().get('cf-connecting-ip') ?? headers().get('x-forwarded-for') ?? '',
    two_factor_verified_at: null,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  // audit log
  await logAction({ action: 'signin', userId: existingUser.id });

  return {
    redirect: '/',
  };
});
