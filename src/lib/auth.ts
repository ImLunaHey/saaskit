import { Lucia, Session, TimeSpan, User } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';
import { cache } from 'react';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { cookies } from 'next/headers';

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: 'user',
    session: 'session',
  });
  return new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(30, 'd'), // 30 days
    getSessionAttributes(databaseSessionAttributes) {
      return {
        userAgent: databaseSessionAttributes.user_agent,
        ipAddress: databaseSessionAttributes.ip_address,
        createdAt: new Date(databaseSessionAttributes.created_at),
        twoFactorVerifiedAt: databaseSessionAttributes.two_factor_verified_at
          ? new Date(databaseSessionAttributes.two_factor_verified_at)
          : null,
      };
    },
    getUserAttributes(databaseUserAttributes) {
      return {
        id: databaseUserAttributes.id,
        username: databaseUserAttributes.username,
        email: databaseUserAttributes.email,
        setupTwoFactor: databaseUserAttributes.two_factor_secret !== null,
        createdAt: new Date(databaseUserAttributes.created_at),
        updatedAt: new Date(databaseUserAttributes.updated_at),
        roles: [
          {
            name: 'user',
            permissions: [
              {
                action: 'read',
                resource: 'user',
              },
            ],
          },
        ],
      };
    },
  });
}

interface DatabaseUserAttributes {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  two_factor_secret: string | null;
  created_at: string;
  updated_at: string;
}

interface DatabaseSessionAttributes {
  user_agent: string;
  ip_address: string;
  created_at: string;
  two_factor_verified_at: string | null;
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
}

export const hashPassword = async (password: string) => {
  const resp = await fetch('https://argon2.xo-140.workers.dev/hash', {
    method: 'POST',
    body: JSON.stringify({
      password,
      options: {
        timeCost: 2,
        memoryCost: 19_456,
        parallelism: 1,
      },
    }),
  });

  const response = await resp.json<{ hash: string }>();
  return response.hash;
};

export const verifyPassword = async ({ password, hash }: { password: string; hash: string }) => {
  const resp = await fetch('https://argon2.xo-140.workers.dev/verify', {
    method: 'POST',
    body: JSON.stringify({ password, hash }),
  });

  const response = await resp.json<{ matches: boolean }>();
  return response.matches;
};

type Auth = { user: User; session: Session } | { user: null; session: null };

export const getAuth = cache(async (): Promise<Auth> => {
  const context = getRequestContext();
  const lucia = initializeLucia(context.env.DATABASE);

  // Get session ID from cookie
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  // Validate session
  const result = await lucia.validateSession(sessionId);

  // Create session
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // next.js throws when you attempt to set cookie when rendering page
  }

  return result;
});

export const getCan = ({ session, user }: Auth) => {
  /**
   * Check if the user has permission to perform an action on a resource
   */
  const can = (action: string, resource: string) => {
    if (!session) return false;
    if (!user) return false;

    return user.roles.some((role) =>
      role.permissions.some((permission) => permission.action === action && permission.resource === resource),
    );
  };

  return can;
};
