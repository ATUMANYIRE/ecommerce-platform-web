import Header from "@/components/nav/Header";
import Footer from "@/components/layout/Footer";
import { AddressProvider } from "@/context/AddressContext";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AddressProvider>{children}</AddressProvider>
      </main>
      <Footer />
    </div>
  );
}
