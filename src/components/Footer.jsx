
import { Link } from "react-router-dom";
import {
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <Link className="brand" to="/">
        <b>☾</b>
        <span>
          DIVINE CARAT
          <small>THE ART OF THE UNIVERSE</small>
        </span>
      </Link>

      <p className="footer-tagline">
        A little more wonder. A little more you.
      </p>

      <div className="footer-links">
        <Link to="/tarot">Tarot</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/zodiac">Zodiac</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/about">About</Link>
        <Link to="/booking">Book a reading</Link>

        <a href="mailto:hello@divinecarat.com">
          <Mail size={19} strokeWidth={2} />
          Contact
        </a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <Instagram size={19} strokeWidth={2} />
          Instagram
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <Facebook size={19} strokeWidth={2} />
          Facebook
        </a>
      </div>

      <small className="footer-copyright">
        © 2026 DIVINE CARAT. ALL RIGHTS RESERVED.
      </small>
    </footer>
  );
}
