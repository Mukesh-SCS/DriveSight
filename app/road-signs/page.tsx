import type { Metadata } from "next";
import { RoadSignsViewer } from "@/components/RoadSignsViewer";

export const metadata: Metadata = {
  title: "US Road Symbol Signs | DriveSight",
  description: "Browse official US road symbol sign reference sheets.",
};

export default function RoadSignsPage() {
  return (
    <main className="signs-shell">
      <RoadSignsViewer />
    </main>
  );
}
