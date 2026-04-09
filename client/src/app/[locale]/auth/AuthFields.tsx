import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/formElements/Form';
import { Input } from '@/components/ui/formElements/Input';
import { RegisterDto } from '@/generated/orval/types';
import { validEmailRegex } from '@/shared/regex';
import { UseFormReturn } from 'react-hook-form';

export interface AuthFieldsProps {
  form: UseFormReturn<RegisterDto, any, RegisterDto>;
  isPending: boolean;
  isReg?: boolean;
}

export function AuthFields({ form, isPending, isReg }: AuthFieldsProps) {
  const passwordValue = form.watch('password', '');
  const strength =
    passwordValue.length >= 8
      ? 'strong'
      : passwordValue.length >= 6
        ? 'medium'
        : 'weak';
  return (
    <>
      <FormField<RegisterDto, 'email'>
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
                autoComplete='email'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField<RegisterDto, 'password'>
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
              <Input
                placeholder='Password'
                type='password'
                disabled={isPending}
                autoComplete='current-password'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isReg && passwordValue && (
        <div className='mt-2 flex gap-1'>
          {['weak', 'medium', 'strong'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all ${
                strength === 'strong'
                  ? 'bg-green-500'
                  : strength === 'medium' && i < 2
                    ? 'bg-yellow-500'
                    : strength === 'weak' && i === 0
                      ? 'bg-red-500'
                      : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      )}
      <>
        {isReg && (
          <>
            <div className='grid items-start gap-4 sm:grid-cols-2'>
              <FormField<RegisterDto, 'name'>
                control={form.control}
                name='name'
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Name'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<RegisterDto, 'phone'>
                control={form.control}
                name='phone'
                // rules={{ required: 'Phone is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Phone'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid items-start gap-4 sm:grid-cols-2'>
              <FormField<RegisterDto, 'country'>
                control={form.control}
                name='country'
                // rules={{ required: 'Country is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Country'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<RegisterDto, 'city'>
                control={form.control}
                name='city'
                // rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='City'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid items-start gap-4 sm:grid-cols-2'>
              <FormField<RegisterDto, 'address'>
                control={form.control}
                name='address'
                // rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Address'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<RegisterDto, 'postalCode'>
                control={form.control}
                name='postalCode'
                // rules={{ required: 'PostalCode is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder='Postal code'
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </>
    </>
  );
}
