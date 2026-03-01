import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryExplorer } from "@/components/home/CategoryExplorer";
import { ProductGrid } from "@/components/home/ProductGrid";
import { Footer } from "@/components/home/Footer";
import { db } from "@/lib/db";
import { heroContent, products, categories, brands } from "@/lib/schema";
import { eq, asc, desc } from "drizzle-orm";

export const revalidate = 60;

async function getHeroContent() {
  try {
    return await db
      .select()
      .from(heroContent)
      .where(eq(heroContent.isActive, true))
      .orderBy(asc(heroContent.order));
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    return await db
      .select({
        id: products.id,
        name: products.name,
        modelNumber: products.modelNumber,
        description: products.description,
        price: products.price,
        offerPrice: products.offerPrice,
        images: products.images,
        categoryId: products.categoryId,
        brandId: products.brandId,
        tagIds: products.tagIds,
        features: products.features,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        isActive: products.isActive,
        stock: products.stock,
        createdAt: products.createdAt,
        categoryName: categories.name,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(10);
  } catch (error) {
    console.error("Error fetching featured products:", error);
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
