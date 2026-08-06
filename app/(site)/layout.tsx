import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <CartProvider>
      <Nav siteName={settings.site_name} />
      {children}
      <Footer settings={settings} />
      <CartDrawer />
    </CartProvider>
  );
}
