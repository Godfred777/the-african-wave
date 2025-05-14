import BreakingNews from "../components/breakingNews";

export default function BreakingNewsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <BreakingNews />
      </main>
    </div>
  );
}
