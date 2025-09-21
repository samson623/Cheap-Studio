"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  name: string;
  sizeLabel: string;
  file: File;
  preview: string;
  url?: string;
  uploading?: boolean;
  uploadError?: string;
};

type UploadDropzoneProps = {
  label: string;
  helper: string;
  file: UploadedFile | null;
  onFileChange: (value: UploadedFile | null) => void;
  accept?: string;
  className?: string;
};

export function UploadDropzone({
  label,
  helper,
  file,
  onFileChange,
  accept = "image/*",
  className,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const uploadFile = async (fileBlob: File) => {
    const formData = new FormData();
    formData.append('file', fileBlob);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return result.data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const fileBlob = files[0];
    
    // First create the file object with preview
    const reader = new FileReader();
    reader.onload = async () => {
      const uploadedFile: UploadedFile = {
        name: fileBlob.name,
        sizeLabel: formatFileSize(fileBlob.size),
        file: fileBlob,
        preview: typeof reader.result === "string" ? reader.result : "",
        uploading: true,
      };
      
      onFileChange(uploadedFile);

      // Then upload the file
      setUploading(true);
      try {
        const url = await uploadFile(fileBlob);
        onFileChange({
          ...uploadedFile,
          url,
          uploading: false,
        });
      } catch (error) {
        onFileChange({
          ...uploadedFile,
          uploading: false,
          uploadError: error instanceof Error ? error.message : 'Upload failed',
        });
      } finally {
        setUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };
    reader.readAsDataURL(fileBlob);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-xs font-medium uppercase tracking-wide text-white/60">
        {label}
      </div>
      <div
        className="flex h-40 cursor-pointer flex-col justify-center rounded-xl border border-dashed border-white/15 bg-slate-950/40 text-center text-xs text-white/60 transition hover:border-white/30 hover:text-white/80"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
          {file?.preview ? (
            <div className="relative">
              <Image
                src={file.preview}
                alt={file.name}
                width={120}
                height={120}
                unoptimized
                className="h-24 w-24 rounded-md object-cover shadow-lg"
              />
              {(file.uploading || uploading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                  <div className="text-xs text-white">Uploading...</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm font-semibold text-white/70">
              Drop or click to upload
            </p>
          )}
          <div className="text-xs text-white/60">
            <p>{helper}</p>
            {file && (
              <div className="mt-1 space-y-1">
                <p className="truncate text-sky-300">
                  {file.name} · {file.sizeLabel}
                </p>
                {file.uploading && (
                  <p className="text-yellow-400">Uploading...</p>
                )}
                {file.url && !file.uploading && (
                  <p className="text-green-400">✓ Ready</p>
                )}
                {file.uploadError && (
                  <p className="text-red-400">✗ {file.uploadError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}

export function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
