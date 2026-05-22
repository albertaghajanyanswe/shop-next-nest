'use client';

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
import { useTranslations } from 'next-intl';

export interface AuthFieldsProps {
  form: UseFormReturn<RegisterDto, any, RegisterDto>;
  isPending: boolean;
  isReg?: boolean;
}

export function AuthFields({ form, isPending, isReg }: AuthFieldsProps) {
  const t = useTranslations('Auth');
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
          required: t('email_required'),
          pattern: {
            value: validEmailRegex,
            message: t('email_invalid'),
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder={t('email_placeholder')}
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
          required: t('password_required'),
          minLength: {
            value: 6,
            message: t('password_min_length'),
          },
        }}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder={t('password_placeholder')}
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
                rules={{ required: t('name_required') }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('name_placeholder')}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('phone_placeholder')}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('country_placeholder')}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('city_placeholder')}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('address_placeholder')}
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
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t('postal_code_placeholder')}
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
