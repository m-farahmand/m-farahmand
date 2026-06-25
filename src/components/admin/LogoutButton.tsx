"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("admin");

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="block w-full px-3 py-2 text-start text-sm text-red-400 hover:text-red-300"
    >
      {t("signOut")}
    </button>
  );
}
