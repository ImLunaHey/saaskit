import { MainNav } from '@/components/main-nav';
import { SigninForm } from './signin/form';
import { getAuth } from '@/lib/auth';

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const auth = await getAuth();
  if (!auth.session) return <SigninForm />;

  return (
    <>
      <MainNav />
      {children}
    </>
  );
}
