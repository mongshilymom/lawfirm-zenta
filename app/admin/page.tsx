import Link from "next/link";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { 
  FileText, 
  Image as ImageIcon, 
  HelpCircle, 
  FolderOpen, 
  Bell,
  TrendingUp 
} from "lucide-react";

interface DashboardStats {
  draftsCount: number;
  publishedCount: number;
  faqsCount: number;
  categoriesCount: number;
  imagesCount: number;
  activeAnnouncements: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminSupabase();

  const { data, error } = await supabase
    .from("admin_stats")
    .select("*")
    .single();

  if (error || !data) {
    return {
      draftsCount: 0,
      publishedCount: 0,
      faqsCount: 0,
      categoriesCount: 0,
      imagesCount: 0,
      activeAnnouncements: 0,
    };
  }

  return {
    draftsCount: data.drafts_count || 0,
    publishedCount: data.published_count || 0,
    faqsCount: data.faqs_count || 0,
    categoriesCount: data.categories_count || 0,
    imagesCount: data.images_count || 0,
    activeAnnouncements: data.active_announcements || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Posts",
      icon: FileText,
      stats: [
        { label: "Published", value: stats.publishedCount },
        { label: "Drafts", value: stats.draftsCount },
      ],
      href: "/admin/posts",
      color: "blue",
    },
    {
      title: "Images",
      icon: ImageIcon,
      stats: [{ label: "Total", value: stats.imagesCount }],
      href: "/admin/images",
      color: "purple",
    },
    {
      title: "FAQs",
      icon: HelpCircle,
      stats: [{ label: "Total", value: stats.faqsCount }],
      href: "/admin/faqs",
      color: "green",
    },
    {
      title: "Categories",
      icon: FolderOpen,
      stats: [{ label: "Total", value: stats.categoriesCount }],
      href: "/admin/categories",
      color: "yellow",
    },
    {
      title: "Announcements",
      icon: Bell,
      stats: [{ label: "Active", value: stats.activeAnnouncements }],
      href: "/admin/announcements",
      color: "red",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-[--color-ink]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-[--color-pewter]">
          Manage your website content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <div className="mt-3 space-y-1">
                    {card.stats.map((stat) => (
                      <div key={stat.label} className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </span>
                        <span className="text-sm text-gray-500">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${card.color}-50`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Create New Post</span>
          </Link>
          <Link
            href="/admin/images"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-900">Upload Images</span>
          </Link>
          <Link
            href="/admin/faqs/new"
            className="flex items-center gap-3 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">Add FAQ</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Link
            href="/admin/audit-logs"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All →
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          Activity log will appear here...
        </div>
      </div>
    </div>
  );
}
