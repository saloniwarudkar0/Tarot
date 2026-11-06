
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Button({
  children,
  to = "/booking",
  light = false,
  onClick,
}) {
  return (
    <Link
      className={`button ${light ? "light" : ""}`}
      to={to}
      onClick={onClick}
    >
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
