import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/projects", label: "Projects", icon: "🏗️" },
  { href: "/expenses", label: "Expenses", icon: "💶" },
  { href: "/work", label: "Work", icon: "🛠️" },
  { href: "/diary", label: "Diary", icon: "📝" },
  { href: "/reports", label: "Reports", icon: "📈" },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-2xl shadow-slate-950/30 md:flex">
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-4xl justify-around gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-1 flex-col items-center rounded-xl px-2 py-2 text-[11px] font-medium transition ${
                  isActive
                    ? "bg-sky-500 text-white"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span className="mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
