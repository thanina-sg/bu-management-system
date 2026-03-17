import { NavLink } from "react-router-dom";

export function TopNavLink(props: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        [
          "text-xs font-medium transition-colors",
          isActive ? "text-brand-700" : "text-ink-500 hover:text-ink-700",
        ].join(" ")
      }
    >
      {props.children}
    </NavLink>
  );
}
