import brands from "../data/brands.json";
export function BrandLogo({ name }: { name: string }) {
  const src = (brands as Record<string, string>)[name];
  return src ? (
    <img className="brand-logo" src={src} alt={name} loading="lazy" />
  ) : (
    <span>{name}</span>
  );
}
