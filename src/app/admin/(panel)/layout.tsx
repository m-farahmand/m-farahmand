import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminNav />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
