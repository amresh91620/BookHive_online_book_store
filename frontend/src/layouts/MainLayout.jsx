import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Marquee Banner */}
      <div className="bg-gradient-to-r from-[#d97642] via-[#e08550] to-[#d97642] border-b border-[#d97642]/20 overflow-hidden">
        <div className="py-1.5 whitespace-nowrap animate-marquee">
          <span className="inline-flex items-center gap-8 text-white font-semibold text-xs sm:text-sm">
            <span className="flex items-center gap-2">
              Welcome to BookHive
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              10,000+ Books Available
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              Free Shipping on Orders Above ₹499
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              Exclusive Deals Daily
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              100% Authentic Books
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              Welcome to BookHive
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              10,000+ Books Available
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              Free Shipping on Orders Above ₹499
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              Exclusive Deals Daily
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-2">
              100% Authentic Books
            </span>
          </span>
        </div>
      </div>
      
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

