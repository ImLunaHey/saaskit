import { MainNav } from '@/components/main-nav';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MainNav />
      {children}
    </>
  );
}
