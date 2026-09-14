import Image from "next/image";
import Link from "next/link";
import { categories } from "@/config/categories";

export default function CategoryGrid() {
  const [featured, ...rest] = categories;

  return (
    <section
      id="categories"
      className="relative z-10 mx-auto w-full max-w-max-width px-margin-mobile md:px-margin-desktop"
    >
      <div className="grid h-auto grid-cols-2 gap-md md:h-[600px] md:grid-cols-4 md:grid-rows-2">
        {featured && (
          <Link
            href={`/search?categoryId=${featured.categoryId}`}
            className="group relative col-span-2 row-span-2 flex h-full items-end justify-center overflow-hidden rounded bg-surface-container-highest pb-md shadow-md aspect-video md:aspect-auto"
          >
            <Image
              src={featured.image}
              alt={`${featured.name} category representative image`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <h3 className="relative z-20 font-title-lg text-[32px] text-white">
              {featured.name}
            </h3>
          </Link>
        )}

        {rest.map((category) => (
          <Link
            key={category.categoryId}
            href={`/search?categoryId=${category.categoryId}`}
            className="group relative flex h-full aspect-square items-end justify-center overflow-hidden rounded bg-surface-container-highest pb-md shadow-md md:aspect-auto"
          >
            <Image
              src={category.image}
              alt={`${category.name} category representative image`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <h3 className="relative z-20 font-title-lg text-title-lg text-white">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
