
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "./Button";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Tarot", path: "/tarot" },
    { name: "Learn", path: "/learn" },
    { name: "Zodiac", path: "/zodiac" },
    { name: "Journal", path: "/journal" },
    { name: "About", path: "/about" },
  ];

  const closeMenu = () => setOpen(false);

  return (
    <header className="header">
      <Link className="brand" to="/" onClick={closeMenu}>
        <b>☾</b>
        <span>
          DIVINE CARAT
          <small>THE ART OF THE UNIVERSE</small>
        </span>
      </Link>

      <button
        className="toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? "nav show" : "nav"}>
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={closeMenu}
          >
            {item.name}
          </NavLink>
        ))}

        <Button onClick={closeMenu}>Book a reading</Button>
      </nav>
    </header>
  );
}
