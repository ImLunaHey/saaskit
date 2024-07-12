'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCommands } from '@/context/commands';
import { useDomain } from '@/context/domain';
import { useSession, useUser } from '@/context/auth';
import { useRouter } from 'next/navigation';

const CodeBlock = ({ header, children }: { header: string; children: React.ReactNode }) => {
  return (
    <Card>
      <CardHeader>{header}</CardHeader>
      <CardContent className="p-4 overflow-hidden">
        <pre className="overflow-scroll">{children}</pre>
      </CardContent>
    </Card>
  );
};

const Content = () => {
  const domain = useDomain();
  const session = useSession();
  const user = useUser();
  return (
    <div className="flex flex-col gap-2 p-4">
      <CodeBlock header="DOMAIN">{JSON.stringify(domain, null, 2)}</CodeBlock>
      <CodeBlock header="USER">{JSON.stringify(user, null, 2)}</CodeBlock>
      <CodeBlock header="SESSION">{JSON.stringify(session, null, 2)}</CodeBlock>
    </div>
  );
};

export default function Home() {
  const { setCommands } = useCommands();
  const router = useRouter();
  setCommands([
    {
      id: 'easter-egg',
      name: 'DO NOT CLICK',
      auth: true,
      onSelect: () => {
        router.push('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      },
    },
  ]);

  return <Content />;
}
