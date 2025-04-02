
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeCustomVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border",
        coming: "bg-red-500/15 text-red-500 border border-red-500/20 dark:bg-red-500/20 dark:text-red-500/90 dark:border-red-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeCustomProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeCustomVariants> {}

function BadgeCustom({ className, variant, ...props }: BadgeCustomProps) {
  return (
    <div className={cn(badgeCustomVariants({ variant }), className)} {...props} />
  );
}

export { BadgeCustom, badgeCustomVariants };
