"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  HelpCircle, 
  FolderOpen, 
  Bell, 
  LogOut 
} from "lucide-react";
import type { AdminSession } from "@/lib/auth/session";

interface AdminNavProps {
  session: AdminSession;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/images", label: "Images", icon: Image },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/announcements", label: "Announcements", icon: Bell },
];

export default function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo & Nav Items */}
          <div className="flex">
            <Link
              href="/admin"
              className="flex items-center px-3 text-xl font-serif font-bold text-[--color-brass]"
            >
              Youalta CMS
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = 
                  pathname === item.href || 
                  (item.href !== "/admin" && pathname?.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Site →
            </Link>
            
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{session.email}</div>
                <div className="text-gray-500 capitalize">{session.role}</div>
              </div>
              
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              pathname === item.href || 
              (item.href !== "/admin" && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
