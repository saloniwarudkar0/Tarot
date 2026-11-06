
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Link as LinkIcon,
  Settings,
  CheckCircle2,
} from "lucide-react";

const initialSettings = {
  siteName: "DIVINE CARAT",
  tagline: "THE ART OF THE UNIVERSE",
  email: "",
  phone: "",
  address: "",
  instagram: "",
  facebook: "",
  pinterest: "",
  maintenance: false,
};

export default function AdminSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demonstration only.
    // Backend/database integration will be added later.
    setSaved(true);
  };

  return (
    <div className="as-page">
      <style>{`
        .as-page {
          min-height: 100vh;
          padding: 38px 5%;
          background: #f7f6f0;
          color: #293d32;
          font-family: Georgia, serif;
        }

        .as-container {
          max-width: 1050px;
          margin: auto;
        }

        .as-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 42px;
        }

        .as-back {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          border: 1px solid #d9ded3;
          border-radius: 4px;
          background: transparent;
          color: #344b3c;
          cursor: pointer;
          font-size: 12px;
        }

        .as-brand {
          font-size: 17px;
          font-weight: bold;
          letter-spacing: 3px;
        }

        .as-brand small {
          display: block;
          margin-top: 6px;
          color: #a28b5c;
          font: 9px Arial, sans-serif;
          letter-spacing: 3px;
        }

        .as-heading {
          margin-bottom: 30px;
        }

        .as-eyebrow {
          color: #a28b5c;
          font: 10px Arial, sans-serif;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .as-heading h1 {
          margin: 12px 0 8px;
          font-size: clamp(32px, 5vw, 46px);
          font-weight: 400;
        }

        .as-heading p {
          color: #7d897e;
          font: 13px Arial, sans-serif;
          line-height: 1.7;
        }

        .as-section {
          margin-bottom: 22px;
          padding: 28px;
          background: #fff;
          border: 1px solid #e7e8df;
          border-radius: 5px;
        }

        .as-section-head {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          margin-bottom: 22px;
          border-bottom: 1px solid #edf0e8;
        }

        .as-section-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #edf0e8;
          color: #a28b5c;
        }

        .as-section-head h2 {
          margin: 0 0 5px;
          font-size: 20px;
          font-weight: 400;
        }

        .as-section-head p {
          margin: 0;
          color: #899187;
          font: 11px Arial, sans-serif;
        }

        .as-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 19px;
        }

        .as-field {
          display: grid;
          gap: 8px;
        }

        .as-field.full {
          grid-column: 1 / -1;
        }

        .as-field label {
          color: #667367;
          font: 10px Arial, sans-serif;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .as-field input,
        .as-field textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 13px;
          border: 1px solid #dfe3d9;
          border-radius: 3px;
          outline: none;
          background: #fff;
          color: #34483a;
          font: 13px Arial, sans-serif;
        }

        .as-field input:focus,
        .as-field textarea:focus {
          border-color: #8d9b84;
        }

        .as-field textarea {
          min-height: 85px;
          resize: vertical;
        }

        .as-input-icon {
          position: relative;
        }

        .as-input-icon > svg {
          position: absolute;
          top: 13px;
          left: 12px;
          color: #a28b5c;
        }

        .as-input-icon input {
          padding-left: 40px;
        }

        .as-maintenance {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px;
          background: #f8f8f3;
          border: 1px solid #e7e8df;
          border-radius: 4px;
        }

        .as-maintenance h3 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 400;
        }

        .as-maintenance p {
          margin: 0;
          color: #899187;
          font: 11px Arial, sans-serif;
          line-height: 1.6;
        }

        .as-switch {
          position: relative;
          width: 45px;
          height: 24px;
          flex-shrink: 0;
        }

        .as-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .as-slider {
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: #c8cec3;
          cursor: pointer;
          transition: .2s;
        }

        .as-slider::before {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          left: 3px;
          top: 3px;
          border-radius: 50%;
          background: white;
          transition: .2s;
        }

        .as-switch input:checked + .as-slider {
          background: #405d49;
        }

        .as-switch input:checked + .as-slider::before {
          transform: translateX(21px);
        }

        .as-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 15px;
          margin-top: 25px;
        }

        .as-saved {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #527251;
          font: 12px Arial, sans-serif;
        }

        .as-save {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 21px;
          border: 0;
          border-radius: 4px;
          background: #304b3b;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }

        @media(max-width: 650px) {
          .as-page { padding: 24px 5%; }
          .as-top { margin-bottom: 30px; }
          .as-section { padding: 20px; }
          .as-grid { grid-template-columns: 1fr; }
          .as-field.full { grid-column: auto; }
          .as-footer {
            align-items: flex-end;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="as-container">
        <header className="as-top">
          <button
            className="as-back"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <div className="as-brand">
            DIVINE CARAT
            <small>ADMIN STUDIO</small>
          </div>
        </header>

        <section className="as-heading">
          <span className="as-eyebrow">Workspace Configuration</span>
          <h1>Website Settings</h1>
          <p>
            Manage your website identity, contact information and
            social media details.
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="as-section">
            <div className="as-section-head">
              <div className="as-section-icon">
                <Globe size={20} />
              </div>
              <div>
                <h2>Website Identity</h2>
                <p>Your brand name and website tagline.</p>
              </div>
            </div>

            <div className="as-grid">
              <div className="as-field">
                <label>Website Name</label>
                <input
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  placeholder="Website name"
                />
              </div>

              <div className="as-field">
                <label>Website Tagline</label>
                <input
                  name="tagline"
                  value={settings.tagline}
                  onChange={handleChange}
                  placeholder="Your tagline"
                />
              </div>
            </div>
          </section>

          <section className="as-section">
            <div className="as-section-head">
              <div className="as-section-icon">
                <Mail size={20} />
              </div>
              <div>
                <h2>Contact Information</h2>
                <p>How visitors can reach your website.</p>
              </div>
            </div>

            <div className="as-grid">
              <div className="as-field">
                <label>Email Address</label>
                <div className="as-input-icon">
                  <Mail size={15} />
                  <input
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div className="as-field">
                <label>Phone Number</label>
                <div className="as-input-icon">
                  <Phone size={15} />
                  <input
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>

              <div className="as-field full">
                <label>Business Address</label>
                <div className="as-input-icon">
                  <MapPin size={15} />
                  <input
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    placeholder="Enter your business address"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="as-section">
            <div className="as-section-head">
              <div className="as-section-icon">
                <LinkIcon size={20} />
              </div>
              <div>
                <h2>Social Media Links</h2>
                <p>Connect your social media profiles.</p>
              </div>
            </div>

            <div className="as-grid">
              <div className="as-field">
                <label>Instagram URL</label>
                <div className="as-input-icon">
                  <Instagram size={15} />
                  <input
                    type="url"
                    name="instagram"
                    value={settings.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div className="as-field">
                <label>Facebook URL</label>
                <div className="as-input-icon">
                  <Facebook size={15} />
                  <input
                    type="url"
                    name="facebook"
                    value={settings.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div className="as-field full">
                <label>Pinterest URL</label>
                <div className="as-input-icon">
                  <LinkIcon size={15} />
                  <input
                    type="url"
                    name="pinterest"
                    value={settings.pinterest}
                    onChange={handleChange}
                    placeholder="https://pinterest.com/..."
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="as-section">
            <div className="as-section-head">
              <div className="as-section-icon">
                <Settings size={20} />
              </div>
              <div>
                <h2>General Preferences</h2>
                <p>Control the basic availability of your website.</p>
              </div>
            </div>

            <div className="as-maintenance">
              <div>
                <h3>Maintenance Mode</h3>
                <p>
                  Enable this when your website needs temporary
                  maintenance.
                </p>
              </div>

              <label className="as-switch">
                <input
                  type="checkbox"
                  name="maintenance"
                  checked={settings.maintenance}
                  onChange={handleChange}
                />
                <span className="as-slider" />
              </label>
            </div>
          </section>

          <div className="as-footer">
            {saved && (
              <span className="as-saved">
                <CheckCircle2 size={16} />
                Settings saved in this session.
              </span>
            )}

            <button type="submit" className="as-save">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
