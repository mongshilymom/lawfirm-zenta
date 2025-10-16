"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  bucket?: string;
}

export default function ImageUploader({ 
  onUploadComplete, 
  bucket = "zenta-images" 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Supabase Storage에 업로드
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      
      alert("이미지 업로드 완료!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert("업로드 실패: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 업로드
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {uploading && (
        <div className="text-sm text-blue-600">업로드 중...</div>
      )}

      {preview && (
        <div>
          <p className="text-sm text-gray-600 mb-2">미리보기:</p>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-xs rounded-md border"
          />
        </div>
      )}
    </div>
  );
}
