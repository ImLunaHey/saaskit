'use server';

import { logAction } from '@/lib/audit-log';
import { getAuth, initializeLucia } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { cookies } from 'next/headers';

export const signout = async () => {
  const { session } = await getAuth();
  if (!session) return;

  const context = getRequestContext();
  const lucia = initializeLucia(context.env.DATABASE);
  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  await logAction({ userId: session.userId, action: 'signout' });

  return {
    redirect: '/',
  };
};
