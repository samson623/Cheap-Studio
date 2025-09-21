"use client";

import type { ComponentProps } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const galleryItem = {
  title: "Stylized portrait in loft studio",
  prompt:
    "Portrait of a curious inventor, messy auburn hair, round glasses, sitting in a sunlit loft surrounded by sketches and gadgets, ultra-detailed, cinematic lighting",
  model: "Gemini 2.5 Flash",
  aspect: "1024 × 1024",
  createdAt: "2 hours ago",
  image:
    "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=900&q=80",
};

export default function GalleryPage() {
  return (
    <div className="relative mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-2 text-white">
        <h1 className="text-3xl font-semibold tracking-tight">My Gallery</h1>
        <p className="text-sm text-white/70">
          Generated images stay on this device for quick inspiration and QA.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-white/10 bg-slate-900/70 text-slate-100 shadow-2xl">
          <CardHeader className="space-y-3 pb-0">
            <Badge className="w-fit border-white/10 bg-sky-500/20 text-sky-200">
              Featured render
            </Badge>
            <CardTitle className="text-xl text-white">{galleryItem.title}</CardTitle>
            <CardDescription className="text-white/70">
              Prompt: {galleryItem.prompt}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <Image
                src={galleryItem.image}
                alt={galleryItem.title}
                width={900}
                height={900}
                className="h-72 w-full object-cover"
              />
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs uppercase text-white/50">Model</span>
                  <p className="font-medium text-white">{galleryItem.model}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-white/50">Aspect</span>
                  <p className="font-medium text-white">{galleryItem.aspect}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-white/50">
                Generated {galleryItem.createdAt}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Prompt saved locally. Inspect before publishing.</span>
              <div className="flex items-center gap-2">
                <IconButton className="bg-violet-500/20 text-violet-200 hover:bg-violet-500/30">
                  <StarIcon />
                </IconButton>
                <IconButton className="bg-sky-500/20 text-sky-200 hover:bg-sky-500/30">
                  <DownloadIcon />
                </IconButton>
                <IconButton className="bg-rose-500/20 text-rose-200 hover:bg-rose-500/30">
                  <TrashIcon />
                </IconButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

type IconButtonProps = ComponentProps<typeof Button>;

function IconButton({ className, children, ...props }: IconButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={cn("h-9 w-9 rounded-full border border-white/10", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3.5 14.09 9l5.41.42-4.1 3.47 1.2 5.61L12 15.9l-4.6 2.6 1.2-5.61-4.1-3.47L9.91 9 12 3.5Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
