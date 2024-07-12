'use client';

import { signin } from './action';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SigninSchema, signinSchema } from './schema';
import { flattenValidationErrors } from 'next-safe-action';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/locales/client';

export const SigninForm = () => {
  const router = useRouter();
  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { isSubmitting } = form.formState;
  const t = useI18n();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const result = await signin(values);
          if (result?.data?.redirect) {
            router.push(result.data.redirect);
            return;
          }
          const flattenedErrors = flattenValidationErrors(result?.validationErrors);

          if (flattenedErrors.formErrors) {
            form.setError('root', {
              type: 'manual',
              message: flattenedErrors.formErrors[0],
            });
          }

          if (flattenedErrors.fieldErrors) {
            for (const [field, message] of Object.entries(flattenedErrors.fieldErrors)) {
              form.setError(field as any, {
                type: 'manual',
                message: message as unknown as string,
              });
            }
          }
        })}
        className="flex justify-center items-center min-h-dvh w-full"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.signin')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.username')}</FormLabel>
                  <FormControl>
                    <Input placeholder="user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.password')}</FormLabel>
                  <FormControl>
                    <Input placeholder="secret-passsword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoadingSpinner />} {isSubmitting ? t('auth.authenticating') : t('auth.signin')}
            </Button>
            <span className="text-sm">
              {t('auth.noAccount')} <Link href="/signup">{t('auth.signup')}</Link>
            </span>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
