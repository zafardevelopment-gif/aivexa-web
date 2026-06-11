import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Server-side guard: every admin page except /admin/login requires
// a valid signed session cookie set by the login action.
export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies();
  if (!verifyToken(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
