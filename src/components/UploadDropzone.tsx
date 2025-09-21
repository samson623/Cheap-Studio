"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  name: string;
  sizeLabel: string;
  file: File;
  preview: string;
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

  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [file]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      onFileChange(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    const fileBlob = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      onFileChange({
        name: fileBlob.name,
        sizeLabel: formatFileSize(fileBlob.size),
        file: fileBlob,
        preview: typeof reader.result === "string" ? reader.result : "",
      });
      if (inputRef.current) {
        inputRef.current.value = "";
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
            <Image
              src={file.preview}
              alt={file.name}
              width={120}
              height={120}
              unoptimized
              className="h-24 w-24 rounded-md object-cover shadow-lg"
            />
          ) : (
            <p className="text-sm font-semibold text-white/70">
              Drop or click to upload
            </p>
          )}
          <div className="text-xs text-white/60">
            <p>{helper}</p>
            {file && (
              <p className="mt-1 truncate text-sky-300">
                {file.name} · {file.sizeLabel}
              </p>
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
