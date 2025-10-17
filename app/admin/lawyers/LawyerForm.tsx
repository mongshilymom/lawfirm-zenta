"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";

interface LawyerFormProps {
  initialData?: {
    id: string;
    name: string;
    role: string;
    practice_areas: string[];
    experience_years: number;
    bio?: string;
    headshot_url?: string;
    is_active: boolean;
  };
}

export default function LawyerForm({ initialData }: LawyerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "Associate");
  const [practiceAreas, setPracticeAreas] = useState<string[]>(initialData?.practice_areas || []);
  const [newArea, setNewArea] = useState("");
  const [experienceYears, setExperienceYears] = useState(initialData?.experience_years || 0);
  const [bio, setBio] = useState(initialData?.bio || "");
  const [headshotUrl, setHeadshotUrl] = useState(initialData?.headshot_url || "");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

  const addPracticeArea = () => {
    if (newArea.trim() && !practiceAreas.includes(newArea.trim())) {
      setPracticeAreas([...practiceAreas, newArea.trim()]);
      setNewArea("");
    }
  };

  const removePracticeArea = (area: string) => {
    setPracticeAreas(practiceAreas.filter((a) => a !== area));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const lawyerData = {
        name,
        role,
        practice_areas: practiceAreas,
        experience_years: experienceYears,
        bio,
        headshot_url: headshotUrl,
        is_active: isActive,
      };

      if (initialData?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from("lawyers")
          .update(lawyerData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        // Create new
        const { error: insertError } = await supabase.from("lawyers").insert([lawyerData]);

        if (insertError) throw insertError;
      }

      router.push("/admin/lawyers");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save lawyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="Associate">Associate</option>
          <option value="Partner">Partner</option>
        </select>
      </div>

      {/* Experience Years */}
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience *
        </label>
        <input
          id="experience"
          type="number"
          min="0"
          value={experienceYears}
          onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Practice Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Practice Areas *</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPracticeArea())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Corporate Law"
          />
          <button
            type="button"
            onClick={addPracticeArea}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {practiceAreas.map((area) => (
            <span
              key={area}
              className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {area}
              <button
                type="button"
                onClick={() => removePracticeArea(area)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {practiceAreas.length === 0 && (
          <p className="text-sm text-red-600 mt-1">Add at least one practice area</p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Biography
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Attorney biography..."
        />
      </div>

      {/* Headshot Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Headshot Photo</label>
        <ImageUploader
          currentImageUrl={headshotUrl}
          onImageUploaded={setHeadshotUrl}
          folder="lawyers"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          id="is_active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          Active (visible on website)
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || practiceAreas.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : initialData ? "Update Lawyer" : "Create Lawyer"}
        </button>
      </div>
    </form>
  );
}
