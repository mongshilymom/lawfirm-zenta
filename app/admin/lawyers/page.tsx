import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import LawyersList from "./LawyersList";

export default async function LawyersPage() {
  const supabase = createServerSupabase();

  const { data: lawyers, error } = await supabase
    .from("lawyers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error loading lawyers: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lawyers</h1>
          <p className="mt-2 text-gray-600">Manage your law firm attorneys</p>
        </div>
        <Link
          href="/admin/lawyers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ➕ Add Lawyer
        </Link>
      </div>

      {/* Lawyers List */}
      <div className="bg-white rounded-lg shadow">
        {!lawyers || lawyers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No lawyers found. Add your first lawyer!</p>
            <Link
              href="/admin/lawyers/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Lawyer
            </Link>
          </div>
        ) : (
          <LawyersList lawyers={lawyers} />
        )}
      </div>
    </div>
  );
}
