'use client';
import { getAuth } from '@/lib/auth';
import { createContext, useContextSelector } from 'use-context-selector';

type ContextType = Omit<Awaited<ReturnType<typeof getAuth>>, 'can'>;

export const AuthContext = createContext<ContextType>({
  session: null,
  user: null,
});

export const useSession = () => useContextSelector(AuthContext, (value) => value.session);
export const useUser = () => useContextSelector(AuthContext, (value) => value.user);

export const AuthProvider = ({ children, value }: React.PropsWithChildren<{ value: ContextType }>) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
