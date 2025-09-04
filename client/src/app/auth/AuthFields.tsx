import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form-elements/Form';
import { Input } from '@/components/ui/form-elements/Input';
import { validEmailRegex } from '@/shared/regex';
import { IAuthForm } from '@/shared/types/auth.interface';
import { UseFormReturn } from 'react-hook-form';

export interface AuthFieldsProps {
  form: UseFormReturn<IAuthForm, any, IAuthForm>;
  isPending: boolean;
  isReg?: boolean;
}

export function AuthFields({ form, isPending, isReg }: AuthFieldsProps) {
  return (
    <>
      {isReg && (
        <>
          <FormField
            control={form.control}
            name='name'
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder='Name' disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={form.control}
        name='email'
        rules={{
          required: 'Email is required',
          pattern: {
            value: validEmailRegex,
            message: 'Invalid email address',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder='Email'
                type='email'
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='password'
        rules={{
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters long',
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder='Password' type='password' disabled={isPending} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
