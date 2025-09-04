import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

const iconVariants = cva('animate-spin text-muted-foreground', {
  variants: {
    size: {
      default: 'size-9',
      sm: 'size-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type TypeIconVariants = VariantProps<typeof iconVariants>;
interface ILoader extends TypeIconVariants {
  className?: string;
}

export const Loader = ({ size, className }: ILoader) => {
  return <LoaderCircle className={cn(iconVariants({ size }), className)} />;
};