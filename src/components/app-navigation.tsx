import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/expenses", label: "Expenses" },
  { href: "/work", label: "Work" },
  { href: "/diary", label: "Diary" },
  { href: "/reports", label: "Reports" },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-2xl shadow-slate-950/30">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-sky-500 text-white"
                : "bg-slate-950/70 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
