'use client';
import { createContext, useContextSelector } from 'use-context-selector';
import { useUser } from './auth';

type Permission = {
  action: string;
  resource: string;
};

type Role = {
  name: string;
  permissions: Permission[];
};

type ContextType = Role[];

const AccessControlContext = createContext<ContextType | null>(null);

export const useAccessControl = () => {
  const roles = useContextSelector(AccessControlContext, (context) => context);

  if (!roles) {
    throw new Error('useAccessControl must be used within an AccessControlProvider');
  }

  const can = (action: string, resource: string) => {
    return roles.some((role) => {
      return role.permissions.some((permission) => {
        return permission.action === action && permission.resource === resource;
      });
    });
  };

  return {
    roles,
    can,
  };
};

export const AccessControlProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  return <AccessControlContext.Provider value={user?.roles ?? []}>{children}</AccessControlContext.Provider>;
};
