"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type CommonHeaderProps = {
  title: string;
  subtitle?: string;
  extraActions?: React.ReactNode[];
};

export function CommonHeader({
  title,
  subtitle,
  extraActions = [],
}: CommonHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Title Screen + subtitle + Extra Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          {subtitle && (
            <h4 className="text-sm text-muted-foreground">{subtitle}</h4>
          )}
        </div>
        <div className="flex gap-2">
          {extraActions.map((btn, i) => (
            <div key={i}>{btn}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
