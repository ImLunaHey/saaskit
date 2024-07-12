import { getRequestContext } from '@cloudflare/next-on-pages';
import { generateIdFromEntropySize } from 'lucia';

export type Actions = 'signup' | 'signin' | 'signout';

export const logAction = async ({ action, userId }: { action: Actions; userId: string }) => {
  console.debug(`Action: ${action}, User: ${userId}`);

  const id = generateIdFromEntropySize(10); // 16 characters long
  const context = getRequestContext();
  const { DATABASE } = context.env;
  await DATABASE.prepare('INSERT INTO audit_log (id, user_id, action, created_at) VALUES (?, ?, ?, ?)')
    .bind(id, userId, action, Date.now())
    .run();
};
