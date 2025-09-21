import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, HeartFilledIcon, Share1Icon } from "@radix-ui/react-icons";

const galleryItems = [
  {
    title: "Product hero",
    description: "Cinematic lighting pass with soft rim and volumetric highlights.",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    tags: ["Portrait", "Studio", "4K"],
    updated: "2 hours ago",
  },
  {
    title: "Concept cityscape",
    description: "Neon skyline with atmospheric perspective and rain reflections.",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    tags: ["Environment", "Night", "Wide"],
    updated: "Yesterday",
  },
  {
    title: "Storyboard frame",
    description: "Early keyframe for onboarding video with warm office lighting.",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    tags: ["Storyboard", "Warm", "1080p"],
    updated: "3 days ago",
  },
];

export default function GalleryPage() {
  return (
    <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-10 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80">
            Gallery
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">My Gallery</h1>
            <p className="max-w-xl text-sm text-white/70">
              Curate your favourite renders, compare iterations, and share quick previews with collaborators.
            </p>
          </div>
        </div>
        <Button className="w-fit rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 text-sm font-medium text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:from-sky-400 hover:to-indigo-400">
          Upload new
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Card
            key={item.title}
            className="overflow-hidden border-white/10 bg-[#101f3c]/60 text-white shadow-[0_25px_60px_rgba(8,15,40,0.45)]"
          >
            <CardContent className="space-y-4 p-0">
              <div className="group relative aspect-square w-full overflow-hidden border-b border-white/10">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  unoptimized
                />
                <Badge className="absolute left-4 top-4 border-white/20 bg-slate-900/70 text-white/80">
                  {item.updated}
                </Badge>
              </div>
              <div className="space-y-4 px-5 pb-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Updated {item.updated}</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white hover:border-sky-400/40 hover:bg-sky-500/10"
                    >
                      <Share1Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-white hover:border-pink-400/40 hover:bg-pink-500/10"
                    >
                      <HeartFilledIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

