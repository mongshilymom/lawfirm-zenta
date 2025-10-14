"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LawyerDirectoryLayout, type LawyerProfile, type FilterState } from "@/components/layouts/LawyerDirectory";

interface LawyerData {
  id: string;
  name: string;
  role: "Partner" | "Associate";
  practice_areas: string[];
  experience_years: number;
  bio: string | null;
  headshot_url: string | null;
}

interface LawyerDirectoryClientProps {
  initialLawyers: LawyerData[];
  availableSpecialties: string[];
  availableRoles: string[];
}

function transformLawyer(lawyer: LawyerData): LawyerProfile {
  return {
    id: lawyer.id,
    name: lawyer.name,
    specialty: lawyer.practice_areas[0] || "General Practice",
    role: lawyer.role,
    yearsExperience: lawyer.experience_years,
    summary: lawyer.bio || undefined,
    location: undefined,
  };
}

export default function LawyerDirectoryClient({
  initialLawyers,
  availableSpecialties,
  availableRoles,
}: LawyerDirectoryClientProps) {
  const router = useRouter();
  const [lawyers] = useState<LawyerProfile[]>(() => 
    initialLawyers.map(transformLawyer)
  );

  const handleFiltersChange = useCallback((filters: FilterState) => {
    console.log("Filters changed:", filters);
    // TODO: Implement server-side filtering via API route
  }, []);

  const handleLawyerClick = useCallback((lawyer: LawyerProfile) => {
    router.push(`/lawyers/${lawyer.id}`);
  }, [router]);

  return (
    <LawyerDirectoryLayout
      lawyers={lawyers}
      availableSpecialties={availableSpecialties}
      availableRoles={availableRoles}
      experienceRange={{ min: 0, max: 50 }}
      onFiltersChange={handleFiltersChange}
      itemHeight={180}
      overscan={3}
      renderLawyer={(lawyer, index) => (
        <article
          key={lawyer.id}
          onClick={() => handleLawyerClick(lawyer)}
          className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="font-bold text-lg mb-1">{lawyer.name}</h3>
          {lawyer.specialty && (
            <p className="text-gray-600 text-sm">{lawyer.specialty}</p>
          )}
          {lawyer.role && (
            <p className="text-gray-500 text-sm">{lawyer.role}</p>
          )}
          {typeof lawyer.yearsExperience === "number" && (
            <p className="text-gray-900 text-sm mt-2">
              {lawyer.yearsExperience} years experience
            </p>
          )}
          {lawyer.summary && (
            <p className="text-gray-700 text-sm mt-2 line-clamp-2">
              {lawyer.summary}
            </p>
          )}
        </article>
      )}
    />
  );
}
