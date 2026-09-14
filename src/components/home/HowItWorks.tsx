const steps = [
  { number: "1", label: "Browse" },
  { number: "2", label: "Add to Cart" },
  { number: "3", label: "Checkout" },
  { number: "4", label: "Delivered" },
];

export default function HowItWorks() {
  return (
    <section className="relative z-10 mx-auto my-xl w-full max-w-max-width border-y border-white/5 px-margin-mobile py-xl md:px-margin-desktop">
      <h2 className="mb-xl text-center font-title-lg text-title-lg text-on-surface">
        How it Works
      </h2>

      <div className="relative mx-auto flex max-w-3xl items-center justify-between">
        <div
          className="absolute left-[10%] right-[10%] top-1/2 z-0 hidden h-[2px] -translate-y-1/2 border-t-2 border-dashed border-[#C9A86A] opacity-20 md:block"
          style={{ borderRadius: "50% 50% 0 0 / 10px 10px 0 0" }}
        />

        {steps.map((step) => (
          <div
            key={step.number}
            className="z-10 flex flex-col items-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#C9A86A]/30 bg-surface-container-highest font-serif text-xl text-[#C9A86A] shadow-lg">
              {step.number}
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
