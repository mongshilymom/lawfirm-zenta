import HeroArch from "@/components/sections/HeroArch";
import LawyerDirectory from "@/components/layouts/LawyerDirectory";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-16 py-16">
      <HeroArch />
      <LawyerDirectory />
    </main>
  );
}