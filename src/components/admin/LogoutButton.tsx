"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300"
    >
      Sign out
    </button>
  );
}
