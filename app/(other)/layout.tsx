import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function OtherLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
      <div className="min-h-screen flex flex-col">
        <div className="top-0 left-0 z-50 w-full px-4">
          <Header />
        </div>

        {children}

        <div className="bottom-0 left-0 z-30 w-full px-4 bg-white">
          <BottomNav />
        </div>
      </div>
  );
}

