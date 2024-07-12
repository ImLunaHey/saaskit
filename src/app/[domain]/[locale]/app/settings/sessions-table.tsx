'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchSessions, revokeSession } from './action';
import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { useSession } from '@/context/auth';
import { getQueryClient } from '@/components/tanstack-provider';
import { useCurrentLocale, useI18n } from '@/locales/client';
import { toast } from 'sonner';
import { useUAParser } from '@/hooks/use-us-parser';
import { RelativeDate } from '@/components/relative-date';

const ActionsRow = ({ id }: { id: string }) => {
  const queryClient = getQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['revoke-session'],
    mutationFn: (id: string) => {
      return revokeSession(id);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['sessions'],
      });

      toast.success('Session revoked', {
        position: 'top-center',
        closeButton: true,
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onSelect={() => {
            mutate(id);
          }}
        >
          Force signout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Browser = ({ userAgent }: { userAgent: string }) => {
  const result = useUAParser(userAgent);
  if (!result) return null;

  return (
    <div>
      {result.browser.name} {result.browser.version}
    </div>
  );
};

const OperatingSystem = ({ userAgent }: { userAgent: string }) => {
  const result = useUAParser(userAgent);
  if (!result) return null;

  if (result.os.name?.startsWith('Mac OS')) {
    return <div>macOS</div>;
  }

  return (
    <div>
      {result.os.name} {result.os.version}
    </div>
  );
};

export const SessionsTable = () => {
  const t = useI18n();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { data } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => {
      return fetchSessions();
    },
  });

  const columns: ColumnDef<Awaited<ReturnType<typeof fetchSessions>>[number]>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'operating_system',
      accessorFn: (row) => row.user_agent,
      header: t('settings.sessionsTable.os'),
      cell: ({ row }) => <OperatingSystem userAgent={row.getValue('operating_system')} />,
    },
    {
      accessorKey: 'browser',
      accessorFn: (row) => row.user_agent,
      header: t('settings.sessionsTable.browser'),
      cell: ({ row }) => <Browser userAgent={row.getValue('browser')} />,
    },
    {
      accessorKey: 'ip_address',
      header: t('settings.sessionsTable.ipAddress'),
      cell: ({ row }) => <div>{row.getValue('ip_address')}</div>,
    },
    {
      accessorKey: 'expires_at',
      header: t('settings.sessionsTable.expiresAt'),
      cell: ({ row }) => <RelativeDate date={new Date(Number(row.getValue('expires_at')) * 1000)} />,
    },
    {
      accessorKey: 'created_at',
      header: t('settings.sessionsTable.createdAt'),
      cell: ({ row }) => <RelativeDate date={new Date(Number(row.getValue('created_at')))} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => <ActionsRow id={row.getValue('id')} />,
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <h1>{t('settings.sessions')}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
