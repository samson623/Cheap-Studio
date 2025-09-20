import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OutputCardProps = {
  title?: string;
  description?: string;
  kind?: "image" | "video";
};

export default function OutputCard({ title = "Output", description = "Preview", kind = "image" }: OutputCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-md bg-muted grid place-items-center">
          <span className="text-muted-foreground text-sm">{kind === "image" ? "Image preview" : "Video preview"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

