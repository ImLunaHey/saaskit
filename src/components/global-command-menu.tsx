'use client';
import { ChevronRightIcon, GearIcon, HomeIcon, PersonIcon, QuestionMarkIcon } from '@radix-ui/react-icons';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/auth';
import { useCommands } from '@/context/commands';
import { useKeyDown } from '@/hooks/use-key-down';
import { useI18n } from '@/locales/client';

type CommandGroup = {
  id: string;
  name: string;
  commands: {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    shortcut?: string;
    onSelect?: () => void;
  }[];
}[];

export function GlobalCommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useUser();
  const { commands } = useCommands();
  const t = useI18n();

  // Open the command dialog with Cmd+K
  useKeyDown(
    {
      key: 'k',
      meta: true,
    },
    () => setOpen((open) => !open),
  );

  const commandGroups = [
    {
      id: 'page',
      name: t('cmdk.pageActions'),
      commands: commands.map((command) => ({
        ...command,
        id: `action-${command.id}`,
        icon: command.icon ?? QuestionMarkIcon,
      })),
    },
    {
      id: 'navigation',
      name: t('cmdk.navigation'),
      commands: [
        {
          id: 'home',
          name: t('home.title'),
          icon: HomeIcon,
          onSelect: () => {
            router.push('/');
            setOpen(false);
          },
        },
      ],
    },
    {
      id: 'account',
      name: t('cmdk.account'),
      commands: user
        ? [
            {
              id: 'settings',
              name: t('settings.title'),
              icon: GearIcon,
              onSelect: () => {
                router.push('/settings');
                setOpen(false);
              },
            },
            {
              id: 'signout',
              name: t('auth.signout'),
              icon: PersonIcon,
              onSelect: () => {
                router.push('/signout');
                setOpen(false);
              },
            },
          ]
        : [
            {
              id: 'signin',
              name: t('auth.signin'),
              icon: PersonIcon,
              onSelect: () => {
                router.push('/signin');
                setOpen(false);
              },
            },
            {
              id: 'signup',
              name: t('auth.signup'),
              icon: PersonIcon,
              onSelect: () => {
                router.push('/signup');
                setOpen(false);
              },
            },
          ],
    },
  ] satisfies CommandGroup as CommandGroup;

  const commandUsage = JSON.parse(localStorage.getItem('commandsUsage') || '{}') as Record<string, Record<string, number>>;
  const mostUsedCommands = Object.entries(commandUsage)
    .toSorted((a, b) => {
      const aCount = Object.values(a[1]).reduce((acc, count) => acc + count, 0);
      const bCount = Object.values(b[1]).reduce((acc, count) => acc + count, 0);
      return bCount - aCount;
    })
    .slice(0, 3);

  const recordCommandUsage = (groupId: string, commandId: string) => {
    commandUsage[groupId] = commandUsage[groupId] || {};
    commandUsage[groupId][commandId] = (commandUsage[groupId][commandId] || 0) + 1;

    localStorage.setItem('commandsUsage', JSON.stringify(commandUsage));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('cmdk.typeACommandOrSearch')} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={t('cmdk.frequentyUsed')}>
          {mostUsedCommands.map(([groupId]) => {
            const group = commandGroups.find((group) => group.id === groupId);
            return group?.commands
              .toSorted((a, b) => (commandUsage[groupId][b.id] || 0) - (commandUsage[groupId][a.id] || 0))
              .map((command) => (
                <CommandItem
                  key={`frequently-used-${command.id}`}
                  value={`frequently-used-${command.id}`}
                  onSelect={() => {
                    recordCommandUsage(groupId, command.id);
                    command.onSelect?.();
                  }}
                  className={command.onSelect && 'cursor-pointer'}
                >
                  {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                  <span className="flex flex-row gap-1">
                    {group.name}
                    <ChevronRightIcon />
                    {command.name}
                  </span>
                  {command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
                </CommandItem>
              ));
          })}
        </CommandGroup>
        <CommandSeparator />
        {commandGroups
          .filter((group) => group.commands.length >= 1)
          .map((group, index) => (
            <Fragment key={`command-group-fragment-${group.id}`}>
              <CommandGroup heading={group.name}>
                {group.commands.map((command) => (
                  <CommandItem
                    key={`${group.id}-${command.id}`}
                    value={`${group.id}-${command.id}`}
                    onSelect={() => {
                      recordCommandUsage(group.id, command.id);
                      command.onSelect?.();
                    }}
                    className={command.onSelect && 'cursor-pointer'}
                  >
                    {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                    <span>{command.name}</span>
                    {command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
              {commandGroups.length - 1 !== index && <CommandSeparator key={`${group.id}-separator`} />}
            </Fragment>
          ))}
      </CommandList>
    </CommandDialog>
  );
}
