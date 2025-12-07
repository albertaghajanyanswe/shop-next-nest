'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@/utils/common';
import { Label } from '@/components/ui/formElements/Label';

const Form = FormProvider;

/* -------------------------------------------------------
   FIELD CONTEXT
------------------------------------------------------- */

type FormFieldContextValue<T extends FieldValues = FieldValues> = {
  name: FieldPath<T>;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

export function useFormFieldContext() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) {
    throw new Error('useFormFieldContext must be used inside <FormField>');
  }
  return ctx;
}

/* -------------------------------------------------------
   FORM FIELD (controller wrapper)
------------------------------------------------------- */

interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, 'render' | 'name'> {
  name: TName;
  render: (props: { field: any, fieldState: any }) => React.ReactElement; // <<< ключевой момент
}

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ name, render, ...props }: FormFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        {...(props as ControllerProps<TFieldValues, TName>)}
        name={name}
        render={({ field, fieldState }) => render({ field, fieldState })}
      />
    </FormFieldContext.Provider>
  );
}

/* -------------------------------------------------------
   FORM ITEM CONTEXT
------------------------------------------------------- */

type FormItemContextValue = { id: string };

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

export function useFormItem() {
  const ctx = React.useContext(FormItemContext);
  if (!ctx) {
    throw new Error('useFormItem must be used inside <FormItem>');
  }
  return ctx;
}

/* -------------------------------------------------------
   HOOK: useFormField()
------------------------------------------------------- */

function useFormField() {
  const { name } = useFormFieldContext();
  const { id } = useFormItem();

  const { control } = useFormContext();
  const { errors } = useFormState({ control, name });

  const error = errors?.[name];

  return {
    id,
    name,
    error,
    formItemId: `${id}-item`,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
  };
}

/* -------------------------------------------------------
   COMPONENTS
------------------------------------------------------- */

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot='form-item'
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot='form-label'
      data-error={!!error}
      htmlFor={formItemId}
      className={cn('h-5', error && 'text-destructive', className)}
      {...props}
    />
  );
}

function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot='form-control'
      id={formItemId}
      aria-invalid={!!error}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot='form-description'
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const message = error?.message || children;

  if (!message) return null;

  return (
    <p
      data-slot='form-message'
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {String(message)}
    </p>
  );
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
