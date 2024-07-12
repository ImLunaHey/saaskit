'use server';

import { getAuth, getCan } from '@/lib/auth';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { User } from 'lucia';

export const fetchUsers = async () => {
  const auth = await getAuth();
  const can = getCan(auth);
  if (!can('read', 'users')) return [];

  // @TODO: check they're an admin
  const isAdmin = true;
  if (!isAdmin) return [];

  const context = getRequestContext();
  const DATABASE = context.env.DATABASE;
  const { results } = await DATABASE.prepare('SELECT id, username, email FROM user ORDER BY created_at DESC').all<User>();
  return results;
};
