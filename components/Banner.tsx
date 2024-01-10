import * as React from "react";
import { LucideIcon } from "lucide-react";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const backgroundVariants = cva(
  "flex text-center text-sm flex p-4 border w-full items-center",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 text-primary border-yellow-30",
        success: "bg-emerald-700 text-secondary border-emerald-800",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

type backgroundVariantsProps = VariantProps<typeof backgroundVariants>;

interface BannerProps extends backgroundVariantsProps {
  label: string;
}
const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

const Banner = ({ label, variant }: BannerProps) => {
  const Icon = variant ? iconMap[variant] : iconMap["warning"];
  return (
    <div className={cn(backgroundVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};

export default Banner;
