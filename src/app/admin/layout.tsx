import { AdminIntlProvider } from "@/components/admin/AdminIntlProvider";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminIntlProvider>{children}</AdminIntlProvider>;
}
