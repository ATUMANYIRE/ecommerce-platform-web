import { SellerSidebar } from "@/components/seller/SellerSidebar";
import SellerTopBar from "@/components/seller/SellerTopBar";
import SellerBottomNav from "@/components/seller/SellerBottomNav";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <SellerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <SellerTopBar />
        <main className="flex flex-1 flex-col pb-24 md:pb-0">
          {children}
        </main>
      </div>
      <SellerBottomNav />
    </div>
  );
}