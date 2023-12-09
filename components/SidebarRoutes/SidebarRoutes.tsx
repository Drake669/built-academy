"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "../SidebarItem";
import { usePathname } from "next/navigation";

const SidebarRoutes = () => {
  const guestRoutes = [
    {
      icon: Layout,
      label: "Dashoboard",
      href: "/",
    },
    {
      icon: Compass,
      label: "Browse",
      href: "/browse",
    },
  ];

  const teacherRoutes = [
    {
      icon: List,
      label: "Courses",
      href: "/teacher/courses",
    },
    {
      icon: BarChart,
      label: "Analytics ",
      href: "/teacher/analytics",
    },
  ];

  const pathname = usePathname();
  const isTeacherRoute = pathname?.startsWith("/teacher");

  return (
    <div className="flex flex-col h-full">
      {isTeacherRoute
        ? teacherRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))
        : guestRoutes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))}
    </div>
  );
};

export default SidebarRoutes;
