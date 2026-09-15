import type { Metadata } from "next";
import { SellerSidebar } from "@/components/seller/SellerSidebar";
import SellerTopBar from "@/components/seller/SellerTopBar";
import SellerBottomNav from "@/components/seller/SellerBottomNav";
import { adminNav } from "@/components/seller/nav";

export const metadata: Metadata = { title: "Admin Console - Atlas" };

/** Same dashboard shell as the Seller Hub, with admin navigation. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <SellerSidebar nav={adminNav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SellerTopBar nav={adminNav} />
        <main className="flex flex-1 flex-col pb-24 md:pb-0">{children}</main>
      </div>
      <SellerBottomNav nav={adminNav} />
    </div>
  );
}
