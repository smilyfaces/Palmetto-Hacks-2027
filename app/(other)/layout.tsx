import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function OtherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 z-50 w-full px-4">
        <Header />
      </div>

      <main className="flex-1">
        {children}
      </main>

      <div className="fixed bottom-6 left-0 z-30 w-full px-6">
        <div className="rounded-4xl bg-white/80">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

