import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturesBar } from "@/components/home/FeaturesBar";
import { CategoryExplorer } from "@/components/home/CategoryExplorer";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Footer } from "@/components/home/Footer";

export const revalidate = 60;

async function getHeroContent() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/hero-content`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products?isActive=true&limit=10`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [heroData, products] = await Promise.all([
    getHeroContent(),
    getFeaturedProducts(),
  ]);

  return (
    <main className="min-h-svh bg-black selection:bg-gold/30 selection:text-gold">
      <HeroSlider initialData={heroData} />
      {/* <FeaturesBar /> */}
      <CategoryExplorer />
      <ProductGrid
        products={products}
        title="Superior Selection"
        subtitle="Experience the pinnacle of gold and diamond artistry"
      />
      <Footer />
    </main>
  );
}
