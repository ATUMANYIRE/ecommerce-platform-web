import Button from "@/components/ui/Button";
import { heroImage } from "@/lib/demo-data";

export default function Hero() {
  return (
    <section className="relative flex h-[700px] min-h-[500px] w-full items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, #C9A86A 50%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto mt-xl max-w-4xl space-y-lg px-margin-mobile text-center md:mt-xxl md:px-margin-desktop">
        <h1 className="font-display-lg text-display-lg leading-tight tracking-tighter text-on-surface drop-shadow-lg md:text-[80px]">
          Find exactly what you need
        </h1>
        <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant md:text-title-lg">
          Discover a meticulously sourced collection of premium products across
          all categories of your life.
        </p>
        <div className="pt-md">
          <Button href="/search?q=*" variant="gold" size="md">
            Start shopping
          </Button>
        </div>
      </div>
    </section>
  );
}