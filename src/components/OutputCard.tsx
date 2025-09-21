import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OutputCardProps = {
  title?: string;
  description?: string;
  kind?: "image" | "video";
  className?: string;
};

export default function OutputCard({
  title = "Output",
  description = "Preview",
  kind = "image",
  className,
}: OutputCardProps) {
  return (
    <Card className={cn("border-white/10 bg-[#101f3c]/60 text-slate-100 shadow-[0_20px_60px_rgba(8,15,40,0.45)]", className)}>
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardDescription className="text-white/60">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <div className="aspect-video w-full max-w-full bg-gradient-to-br from-slate-800/60 via-slate-900/60 to-slate-950/80">
            <div className="flex h-full items-center justify-center text-sm text-white/50">
              {kind === "image" ? "Image preview" : "Video preview"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

