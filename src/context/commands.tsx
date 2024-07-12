'use client';
import { createContext, useContext } from 'use-context-selector';
import { useSession } from './auth';

type Command = {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  onSelect?: () => void;
  auth?: boolean;
};

type ContextType = Set<Command>;

export const CommandsContext = createContext<ContextType>(new Set<Command>());

const commands = new Set<Command>();

export const useCommands = () => {
  const commands = useContext(CommandsContext);
  const session = useSession();
  return {
    commands: Array.from(commands),
    setCommands: (newCommands: Command[]) => {
      commands.clear();
      newCommands.forEach((command) => {
        if (command.auth && !session) return;
        commands.add(command);
      });
    },
  };
};

export const CommandsProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <CommandsContext.Provider value={commands}>{children}</CommandsContext.Provider>;
};
