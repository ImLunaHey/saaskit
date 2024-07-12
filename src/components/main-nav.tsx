'use client';
import { useSession, useUser } from '@/context/auth';
import TeamSwitcher from './team-switcher';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThemeToggle } from './ui/theme-toggle';
import { useI18n } from '@/locales/client';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const UserNav = () => {
  const user = useUser();
  const t = useI18n();

  if (!user) {
    return <Link href="/signin">{t('auth.signin')}</Link>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${user.username}.png`} alt={`@${user.username}`} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/billing" className="block w-full">
              {t('billing.title')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="block w-full">
              {t('settings.title')}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/signout" className="block">
            {t('auth.signout')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function NavBar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const currentPath = usePathname();
  const session = useSession();

  const navLinks = [
    {
      name: 'Home',
      href: '/',
    },
    session && {
      name: 'Settings',
      href: '/settings',
    },
  ].filter(Boolean);

  const closestPathMatch = navLinks
    .filter((link) => link.href.startsWith(currentPath))
    .toSorted((a, b) => a.href.length - b.href.length)
    .at(0)?.href;

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          onClick={() => {}}
          className={cn(
            'text-sm font-medium transition-colors',
            link.href !== closestPathMatch
              ? 'text-muted-foreground hover:text-primary'
              : 'text-primary hover:text-muted-foreground',
          )}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}

export const MainNav = () => {
  const user = useUser();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {user && <TeamSwitcher user={user} teams={[]} />}
        <NavBar className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
};
