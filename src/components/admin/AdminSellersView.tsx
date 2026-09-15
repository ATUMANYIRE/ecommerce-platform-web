"use client";

import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import { setSellerStatus, useSellerAccounts } from "@/lib/demo/admin";
import type { SellerAccount } from "@/lib/demo/admin";
import { formatAmount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const tone: Record<SellerAccount["status"], string> = {
  ACTIVE: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  ONBOARDING: "border-champagne/30 bg-champagne/10 text-champagne",
  SUSPENDED: "border-error/30 bg-error/10 text-error",
};

/** Seller accounts with approve / suspend actions (demo). */
export default function AdminSellersView() {
  const sellers = useSellerAccounts();

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader title="Sellers" description="Approve new stores and suspend sellers that break the rules." />
      <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ivory/10">
                {["Store", "Owner", "Products", "Sales", "Joined", "Status", ""].map((heading) => (
                  <th key={heading} className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id} className="border-b border-ivory/5 last:border-0">
                  <td className="px-lg py-md font-body-md text-body-md text-ivory">{seller.storeName}</td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{seller.owner}</td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{seller.products}</td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface">{formatAmount(seller.sales, "USD")}</td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{seller.joined}</td>
                  <td className="px-lg py-md">
                    <span className={cn("inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider", tone[seller.status])}>{seller.status}</span>
                  </td>
                  <td className="px-lg py-md text-right">
                    {seller.status === "ONBOARDING" ? (
                      <button type="button" onClick={() => setSellerStatus(seller.id, "ACTIVE")} className="font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-secondary-fixed">
                        Approve
                      </button>
                    ) : seller.status === "ACTIVE" ? (
                      <button type="button" onClick={() => setSellerStatus(seller.id, "SUSPENDED")} className="font-label-md text-label-md uppercase tracking-wider text-error hover:opacity-80">
                        Suspend
                      </button>
                    ) : (
                      <button type="button" onClick={() => setSellerStatus(seller.id, "ACTIVE")} className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory">
                        Reinstate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
