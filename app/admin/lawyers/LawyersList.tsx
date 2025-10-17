"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Lawyer {
  id: string | number;
  name: string;
  role: string;
  practice_areas: string[];
  experience_years: number;
  bio?: string;
  headshot_url?: string;
  is_active: boolean;
}

interface LawyersListProps {
  lawyers: Lawyer[];
}

export default function LawyersList({ lawyers }: LawyersListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this lawyer?")) return;
    setDeleting(String(id));
    try {
      const { error } = await supabase.from("lawyers").delete().eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch (error: any) {
      alert(`Error deleting lawyer: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practice Areas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lawyers.map((lawyer) => {
            const id = String(lawyer.id);
            return (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {lawyer.headshot_url && (
                      <div className="relative mr-3 h-10 w-10">
                        <Image
                          src={lawyer.headshot_url}
                          alt={lawyer.name}
                          fill
                          className="rounded-full object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div className="text-sm font-medium text-gray-900">{lawyer.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      lawyer.role === "Partner" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lawyer.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.practice_areas.slice(0, 2).map((area, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                    {lawyer.practice_areas.length > 2 && (
                      <span className="text-xs text-gray-500">+{lawyer.practice_areas.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lawyer.experience_years} years</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      lawyer.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {lawyer.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {/* 핵심: UrlObject로 타입 안전하게 전달 */}
                  <Link
                    href={{ pathname: "/admin/lawyers/[id]", query: { id } }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(id)}
                    disabled={deleting === id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    {deleting === id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
