"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  // Fake usage until backend is wired
  const plan = "Starter · $10/mo";
  const imgUsed = 12;
  const imgLimit = 100; // Starter: 100 images
  const vidUsed = 9;
  const vidLimit = 40; // Starter: 40 seconds

  const imagePct = Math.min(100, Math.round((imgUsed / imgLimit) * 100));
  const videoPct = Math.min(100, Math.round((vidUsed / vidLimit) * 100));

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{plan}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {imgUsed} / {imgLimit}
              </span>
              <span>{imagePct}%</span>
            </div>
            <Progress value={imagePct} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Video Seconds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {vidUsed} / {vidLimit}
              </span>
              <span>{videoPct}%</span>
            </div>
            <Progress value={videoPct} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

