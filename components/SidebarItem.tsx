"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, href, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <button
      className={cn(
        "flex items-center gap-x-4 pl-6 text-sm text-slate-500 hover:text-blue-950 hover:bg-blue-100 mt-1 font-bold",
        isActive &&
          "text-blue-950 bg-blue-100 hover:text-blue-950 hover:bg-blue-100"
      )}
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} />
        {label}
      </div>
      <div
        className={cn(
          "border-2 border-blue-950 h-full ml-auto opacity-0",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default SidebarItem;
