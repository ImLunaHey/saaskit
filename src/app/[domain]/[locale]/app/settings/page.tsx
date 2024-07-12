import { getAuth } from '@/lib/auth';
import { AuditLogTable } from './audit-log-table';
import { SessionsTable } from './sessions-table';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { TwoFactor } from './two-factor';

export default async function Page() {
  const context = await getAuth();
  if (!context.session) {
    return redirect('/signin');
  }

  return (
    <>
      <Card className="p-4">
        <TwoFactor />
      </Card>

      <Card className="p-4">
        <SessionsTable />
      </Card>

      <Card className="p-4">
        <AuditLogTable />
      </Card>
    </>
  );
}
