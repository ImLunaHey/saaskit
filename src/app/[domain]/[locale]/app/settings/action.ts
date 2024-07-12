'use server';
import { initializeLucia, getAuth } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { headers } from 'next/headers';
import { createTOTPKeyURI } from 'oslo/otp';
import { encodeHex } from 'oslo/encoding';

export const fetchSessions = async () => {
  const context = getRequestContext();
  const { session } = await getAuth();
  const { DATABASE } = context.env;

  if (!session) return [];

  const { results } = await DATABASE.prepare(
    'SELECT id, created_at, expires_at, user_agent, ip_address FROM session WHERE user_id = ? ORDER BY expires_at DESC',
  )
    .bind(session.userId)
    .all();
  return results as { id: string; expires_at: string; created_at: string; user_agent: string; ip_address: string }[];
};

export const revokeSession = async (sessionId: string) => {
  const context = getRequestContext();
  const { session } = await getAuth();
  const { DATABASE } = context.env;

  if (!session) return;
  const lucia = initializeLucia(DATABASE);
  await lucia.invalidateSession(sessionId);
};

export const fetchAuditLog = async () => {
  const context = getRequestContext();
  const { session } = await getAuth();
  const { DATABASE } = context.env;

  if (!session) return [];

  const { results } = await DATABASE.prepare(
    'SELECT id, action, created_at FROM audit_log WHERE user_id = ? ORDER BY created_at DESC',
  )
    .bind(session.userId)
    .all();
  return results as { id: string; action: string; created_at: string }[];
};

export const enableTwoFactor = async () => {
  const context = getRequestContext();
  const { session, user } = await getAuth();
  const { DATABASE } = context.env;

  if (!session) return;

  const twoFactorSecret = crypto.getRandomValues(new Uint8Array(20));

  await DATABASE.prepare('UPDATE user SET two_factor_secret = ?1 WHERE id = ?2')
    .bind(encodeHex(twoFactorSecret), session.userId)
    .run();
  const hostname = headers().get('host')!;
  return createTOTPKeyURI(hostname, user.username, twoFactorSecret);
};
