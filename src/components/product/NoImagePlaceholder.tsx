/**
 * Replaces the product imagery when a product has no image asset. Mirrors the
 * "No Imagery Available" empty state from the design.
 */
export default function NoImagePlaceholder() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#15181C] p-xl text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-variant/20 to-transparent opacity-50" />
      <span className="material-symbols-outlined mb-md text-[64px] text-surface-variant opacity-70 transition-transform duration-500">
        image_not_supported
      </span>
      <h3 className="relative mb-xs font-title-lg text-title-lg text-on-surface">
        No Imagery Available
      </h3>
      <p className="relative max-w-xs font-body-md text-body-md text-on-surface-variant">
        We are currently updating the visual assets for this product. Check
        back shortly.
      </p>
    </div>
  );
}