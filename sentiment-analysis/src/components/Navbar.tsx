import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { AudioWaveform } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { cn } from "../lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#EEF1F6]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <NavLink to="/" className="flex items-center gap-2.5 font-medium tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white">
            <AudioWaveform className="size-4" />
          </span>
          <span className="hidden sm:inline">Sentiment Analysis</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-900/5">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className="group relative rounded-full px-4 py-1.5 text-sm font-medium">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-slate-900"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative transition-colors",
                        isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900"
                      )}
                    >
                      {l.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <StatusBadge />
        </div>
      </div>
    </nav>
  );
}
