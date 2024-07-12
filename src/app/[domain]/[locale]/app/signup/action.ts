'use server';

import { generateIdFromEntropySize } from 'lucia';
import { hashPassword, initializeLucia } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { cookies, headers } from 'next/headers';
import { signupSchema } from './schema';
import { actionClient } from '@/lib/action-client';
import { returnValidationErrors } from 'next-safe-action';
import { logAction } from '@/lib/audit-log';

export const signup = actionClient.schema(signupSchema).action(async ({ parsedInput: { username, email, password } }) => {
  const passwordHash = await hashPassword(password);
  const userId = generateIdFromEntropySize(10); // 16 characters long
  const context = getRequestContext();
  const db = context.env.DATABASE;
  const lucia = initializeLucia(db);

  // check if email is in use
  const emailInUse = await db.prepare('SELECT id FROM user WHERE email = ?').bind(email).first();
  if (emailInUse) {
    return returnValidationErrors(signupSchema, {
      email: {
        _errors: ['Email already registered'],
      },
    });
  }

  // check if username is in use
  const usernameInUse = await db.prepare('SELECT id FROM user WHERE username = ?').bind(username).first();
  if (usernameInUse) {
    return returnValidationErrors(signupSchema, {
      username: {
        _errors: ['Username already registered'],
      },
    });
  }

  // create user
  await db
    .prepare('INSERT INTO user (id, username, email, password_hash, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
    .bind(userId, username, email, passwordHash, Date.now(), Date.now())
    .run();

  const session = await lucia.createSession(userId, {
    created_at: Date.now().toString(),
    user_agent: headers().get('user-agent') ?? '',
    ip_address: headers().get('cf-connecting-ip') ?? headers().get('x-forwarded-for') ?? '',
    two_factor_verified_at: null,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  // audit log
  await logAction({ action: 'signup', userId });

  return {
    redirect: '/',
  };
});
