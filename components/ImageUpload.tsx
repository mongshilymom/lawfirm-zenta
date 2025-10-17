"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  bucket?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  onImageUploaded,
  bucket = "page-images",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onImageUploaded(publicUrl);

      setTimeout(() => setPreview(null), 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      <label
        htmlFor="image-upload"
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white 
                 rounded-md hover:bg-blue-700 transition cursor-pointer text-sm"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            업로드 중...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            이미지 업로드
          </>
        )}
      </label>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {preview && (
        <div className="relative">
          <div className="relative w-full max-w-xs h-56 rounded border overflow-hidden">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 320px"
              unoptimized
            />
          </div>
          <button
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">최대 {maxSizeMB}MB / JPG, PNG, GIF, WebP</p>
    </div>
  );
}
