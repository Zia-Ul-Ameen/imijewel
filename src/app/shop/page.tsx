import { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
    title: "Shop All Collections – ImiJewel",
    description: "Browse our complete collection of premium imitation jewellery. Necklaces, earrings, bangles and more.",
    openGraph: {
        title: "Shop All Collections – ImiJewel",
        description: "Browse our complete collection of premium imitation jewellery.",
    }
};

export default function ShopPage() {
    return <ShopClient />;
}
