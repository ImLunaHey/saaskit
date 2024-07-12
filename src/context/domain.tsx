'use client';

import { createContext, useContext } from 'use-context-selector';

export const DomainContext = createContext<string | null>(null);

export const useDomain = () => useContext(DomainContext);

export const DomainProvider = ({ children, value }: React.PropsWithChildren<{ value: string | null }>) => {
  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
};
