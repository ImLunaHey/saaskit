import { cn } from '@/lib/utils';
import NextLink from 'next/link';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof NextLink>;

export const Link = ({ href, className, children }: LinkProps) => {
  return (
    <NextLink href={href} className={cn('underline', className)}>
      {children}
    </NextLink>
  );
};
