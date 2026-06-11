import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  return (
    <>
      <Nav siteName={settings.site_name} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
