import Image from "next/image";
import Button from "@/components/ui/Button";
import { promoImage } from "@/lib/demo-data";

export default function PromoBanner() {
  return (
    <section
      id="promo"
      className="relative z-10 mt-xl flex h-[500px] w-full items-center justify-center"
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "polygon(0 15%, 100% 0, 100% 85%, 0 100%)" }}
      >
        <Image
          src={promoImage}
          alt="Promo banner background"
          fill
          sizes="100vw"
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 space-y-md px-margin-mobile text-center">
        <h2 className="font-display-md text-[48px] leading-tight text-white drop-shadow-lg md:text-[64px]">
          New arrivals,
          <br />
          updated weekly
        </h2>
        <Button href="/search?q=*" variant="gold" size="md">
          Shop New In
        </Button>
      </div>
    </section>
  );
}
