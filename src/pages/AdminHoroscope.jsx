
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Pencil,
  X,
  Save,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "divineCaratAdminToken";

const emptyForm = {
  dates: "",
  element: "",
  planet: "",
  quality: "",
  color: "",
  traits: "",
  strengths: "",
  weaknesses: "",
  love: "",
  career: "",
  about: "",
  status: "Draft",
};

const profileFields = [
  { name: "dates", label: "Date Range", placeholder: "March 21 – April 19" },
  { name: "element", label: "Element", placeholder: "Fire" },
  { name: "planet", label: "Ruling Planet", placeholder: "Mars" },
  { name: "quality", label: "Quality", placeholder: "Cardinal" },
  { name: "color", label: "Associated Colour", placeholder: "Warm Red" },
];

export default function AdminHoroscope() {
  const navigate = useNavigate();

  const [signs, setSigns] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSign, setSelectedSign] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(TOKEN_KEY);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchSigns = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Admin login session expired. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/zodiac`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load zodiac profiles.");
      }

      setSigns(data.signs || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSigns();
  }, []);

  const published = signs.filter(
    (item) => item.status === "Published"
  ).length;

  const drafts = signs.filter(
    (item) => item.status === "Draft"
  ).length;

  const filteredSigns = useMemo(() => {
    return signs.filter((item) => {
      const matchesSearch = [
        item.name,
        item.dates,
        item.element,
        item.planet,
        item.traits,
        item.about,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSign =
        selectedSign === "All" || item.name === selectedSign;

      return matchesSearch && matchesSign;
    });
  }, [signs, search, selectedSign]);

  const openEditForm = (item) => {
    setEditingId(item._id);

    const updatedForm = {};

    Object.keys(emptyForm).forEach((field) => {
      updatedForm[field] = item[field] || "";
    });

    setForm(updatedForm);
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    const requiredFields = Object.keys(emptyForm).filter(
      (field) => field !== "status"
    );

    const missing = requiredFields.some(
      (field) => !form[field]?.trim()
    );

    if (missing) {
      alert("Please fill all zodiac profile fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const currentSign = signs.find(
        (item) => item._id === editingId
      );

      if (!currentSign) {
        throw new Error("Zodiac profile not found.");
      }

      const payload = {
        name: currentSign.name,
        slug: currentSign.slug,
        symbol: currentSign.symbol,
        dates: form.dates,
        element: form.element,
        planet: form.planet,
        quality: form.quality,
        color: form.color,
        traits: form.traits,
        strengths: form.strengths,
        weaknesses: form.weaknesses,
        love: form.love,
        career: form.career,
        about: form.about,
        status: form.status,
      };

      const response = await fetch(
        `${API_URL}/api/zodiac/${editingId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update zodiac profile.");
      }

      await fetchSigns();
      closeForm();

      alert("Zodiac profile updated successfully!");
    } catch (err) {
      setError(err.message || "Unable to save profile.");
      alert(err.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id) => {
    const item = signs.find((sign) => sign._id === id);

    if (!item) return;

    const newStatus =
      item.status === "Published" ? "Draft" : "Published";

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/zodiac/${id}/status`,
        {
          method: "PATCH",
          headers: authHeaders,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to change status.");
      }

      setSigns((prev) =>
        prev.map((sign) =>
          sign._id === id ? data.sign : sign
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update status.");
      alert(err.message || "Unable to update status.");
    }
  };

  return (
    <div className="ah-page">
      <style>{`
        .ah-page {
          min-height: 100vh;
          background: #f7f6f0;
          color: #293d32;
          padding: 38px 5%;
          font-family: Georgia, serif;
        }
        .ah-container { max-width: 1180px; margin: auto; }
        .ah-top {
          display: flex; justify-content: space-between;
          align-items: center; gap: 15px; margin-bottom: 42px;
        }
        .ah-back {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 16px; border: 1px solid #d9ded3;
          border-radius: 4px; background: transparent;
          color: #344b3c; cursor: pointer; font-size: 12px;
        }
        .ah-brand { font-size: 17px; font-weight: bold; letter-spacing: 3px; }
        .ah-brand small {
          display: block; margin-top: 6px; color: #a28b5c;
          font: 9px Arial, sans-serif; letter-spacing: 3px;
        }
        .ah-heading { margin-bottom: 28px; }
        .ah-eyebrow {
          color: #a28b5c; font: 10px Arial, sans-serif;
          letter-spacing: 3px; text-transform: uppercase;
        }
        .ah-heading h1 {
          margin: 12px 0 8px; font-size: clamp(32px, 5vw, 46px);
          font-weight: 400;
        }
        .ah-heading p {
          color: #7d897e; font: 13px Arial, sans-serif; line-height: 1.7;
        }
        .ah-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 25px;
        }
        .ah-stat {
          padding: 22px; background: #fff;
          border: 1px solid #e8e8df; border-radius: 5px;
        }
        .ah-stat span {
          color: #879084; font: 10px Arial, sans-serif;
          letter-spacing: 1.5px; text-transform: uppercase;
        }
        .ah-stat strong {
          display: block; margin-top: 12px;
          font-size: 30px; font-weight: 400;
        }
        .ah-note {
          display: flex; align-items: flex-start; gap: 9px;
          margin-bottom: 25px; padding: 13px 15px;
          border: 1px solid #e5e7df; background: #f1f3ec;
          color: #657364; font: 11px Arial, sans-serif; line-height: 1.6;
        }
        .ah-zodiac-grid {
          display: grid; grid-template-columns: repeat(6, 1fr);
          gap: 10px; margin-bottom: 35px;
        }
        .ah-zodiac {
          padding: 15px 6px; background: #fff;
          border: 1px solid #e5e7df; border-radius: 4px; text-align: center;
        }
        .ah-zodiac-symbol {
          display: block; color: #a28b5c;
          font-size: 25px; margin-bottom: 6px;
        }
        .ah-zodiac strong {
          display: block; font: 11px Arial, sans-serif; color: #425647;
        }
        .ah-zodiac small {
          display: block; margin-top: 5px;
          color: #9a9e94; font: 9px Arial, sans-serif;
        }
        .ah-toolbar {
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 14px;
          margin-bottom: 20px;
        }
        .ah-toolbar h2 { margin: 0; font-size: 23px; font-weight: 400; }
        .ah-actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .ah-search {
          display: flex; align-items: center; gap: 8px;
          padding: 0 12px; min-width: 210px; background: white;
          border: 1px solid #e3e5dc; border-radius: 4px;
        }
        .ah-search input {
          width: 100%; padding: 12px 0; border: 0;
          outline: 0; background: transparent; font-size: 13px;
        }
        .ah-filter {
          padding: 11px; border: 1px solid #e3e5dc;
          border-radius: 4px; background: white;
          color: #425647; outline: none; font-size: 12px;
        }
        .ah-list { display: grid; gap: 14px; }
        .ah-item {
          display: flex; justify-content: space-between;
          align-items: center; gap: 20px; padding: 22px;
          background: #fff; border: 1px solid #e7e8df; border-radius: 5px;
        }
        .ah-item-main {
          display: flex; align-items: center; gap: 17px; min-width: 0;
        }
        .ah-sign-icon {
          display: grid; place-items: center; width: 54px; height: 54px;
          flex-shrink: 0; border-radius: 50%; background: #edf0e8;
          color: #a28b5c; font-size: 29px;
        }
        .ah-item h3 { margin: 0 0 7px; font-size: 20px; font-weight: 400; }
        .ah-item p {
          max-width: 560px; margin: 0; color: #899187;
          font: 12px Arial, sans-serif; line-height: 1.6;
        }
        .ah-item-meta {
          margin-bottom: 7px; color: #a28b5c; font: 10px Arial, sans-serif;
        }
        .ah-item-actions {
          display: flex; align-items: center; gap: 8px; flex-shrink: 0;
        }
        .ah-status {
          padding: 6px 11px; border-radius: 20px;
          background: #edf3eb; color: #527251; font: 10px Arial, sans-serif;
        }
        .ah-status.draft { background: #f5f0e5; color: #9a7940; }
        .ah-icon-btn {
          display: grid; place-items: center; width: 35px; height: 35px;
          border: 1px solid #e5e7df; border-radius: 4px;
          background: #fff; color: #526354; cursor: pointer;
        }
        .ah-empty {
          padding: 55px 20px; background: white;
          border: 1px solid #e7e8df; color: #899187;
          text-align: center; font: 13px Arial, sans-serif;
        }
        .ah-overlay {
          position: fixed; inset: 0; z-index: 1000;
          display: grid; place-items: center; padding: 18px;
          overflow-y: auto; background: rgba(24, 37, 29, .55);
        }
        .ah-modal {
          width: 100%; max-width: 720px; max-height: 92vh;
          padding: 30px; overflow-y: auto; border-radius: 6px; background: #fff;
        }
        .ah-modal-head {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 8px;
        }
        .ah-modal-head h2 { margin: 0; font-size: 26px; font-weight: 400; }
        .ah-modal-subtitle {
          margin: 0 0 25px; color: #899187;
          font: 12px Arial, sans-serif; line-height: 1.6;
        }
        .ah-close { border: 0; background: transparent; color: #536454; cursor: pointer; }
        .ah-form { display: grid; gap: 17px; }
        .ah-field { display: grid; gap: 8px; }
        .ah-field label {
          color: #667367; font: 10px Arial, sans-serif;
          letter-spacing: 1px; text-transform: uppercase;
        }
        .ah-field input, .ah-field textarea, .ah-field select {
          box-sizing: border-box; width: 100%; padding: 12px;
          border: 1px solid #dfe3d9; border-radius: 3px;
          outline: none; background: #fff; color: #34483a;
          font: 13px Arial, sans-serif;
        }
        .ah-field textarea {
          min-height: 85px; resize: vertical; line-height: 1.6;
        }
        .ah-field input:focus, .ah-field textarea:focus, .ah-field select:focus {
          border-color: #8d9b84;
        }
        .ah-form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        .ah-section-label {
          margin: 10px 0 -5px; padding-bottom: 9px;
          border-bottom: 1px solid #e8e8df; color: #a28b5c;
          font: 10px Arial, sans-serif; letter-spacing: 2px;
          text-transform: uppercase;
        }
        .ah-form-buttons {
          display: flex; justify-content: flex-end;
          gap: 10px; margin-top: 8px;
        }
        .ah-primary {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 17px; border: 0; border-radius: 4px;
          background: #304b3b; color: white; cursor: pointer; font-size: 12px;
        }
        .ah-primary:disabled { opacity: .6; cursor: not-allowed; }
        .ah-cancel {
          padding: 12px 18px; border: 1px solid #dfe3d9;
          border-radius: 4px; background: white; color: #536454; cursor: pointer;
        }
        .ah-error {
          margin-bottom: 18px; padding: 12px 15px;
          border: 1px solid #e6c9c5; background: #fff5f3;
          color: #a33c35; font: 12px Arial, sans-serif;
        }
        .ah-loading {
          padding: 45px 15px; text-align: center;
          color: #68766a; font: 13px Arial, sans-serif;
        }
        @media(max-width: 800px) {
          .ah-zodiac-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media(max-width: 650px) {
          .ah-page { padding: 24px 5%; }
          .ah-top { margin-bottom: 30px; }
          .ah-stats { gap: 8px; }
          .ah-stat { padding: 14px; }
          .ah-stat strong { font-size: 24px; }
          .ah-zodiac-grid { grid-template-columns: repeat(3, 1fr); }
          .ah-item { align-items: flex-start; flex-direction: column; }
          .ah-item-actions { width: 100%; justify-content: flex-end; }
          .ah-form-row { grid-template-columns: 1fr; }
          .ah-modal { padding: 22px; }
          .ah-actions { width: 100%; }
          .ah-search { flex: 1; min-width: 150px; }
        }
      `}</style>

      <div className="ah-container">
        <header className="ah-top">
          <button className="ah-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <div className="ah-brand">
            DIVINE CARAT
            <small>ADMIN STUDIO</small>
          </div>
        </header>

        <section className="ah-heading">
          <span className="ah-eyebrow">Content Management</span>
          <h1>Horoscope Management</h1>
          <p>
            Manage all twelve zodiac profiles, their date ranges,
            characteristics and astrological details.
          </p>
        </section>

        {error && <div className="ah-error">{error}</div>}

        <section className="ah-stats">
          <div className="ah-stat">
            <span>Total Zodiac Signs</span>
            <strong>{signs.length}</strong>
          </div>
          <div className="ah-stat">
            <span>Published Profiles</span>
            <strong>{published}</strong>
          </div>
          <div className="ah-stat">
            <span>Draft Profiles</span>
            <strong>{drafts}</strong>
          </div>
        </section>

        <div className="ah-note">
          <Sparkles size={17} />
          <span>
            Edit any zodiac profile to update its date range and
            information. These fields match the public Zodiac page.
          </span>
        </div>

        {loading ? (
          <div className="ah-loading">Loading zodiac profiles...</div>
        ) : (
          <>
            <section className="ah-zodiac-grid">
              {signs.map((sign) => (
                <div className="ah-zodiac" key={sign._id}>
                  <span className="ah-zodiac-symbol">{sign.symbol}</span>
                  <strong>{sign.name}</strong>
                  <small>{sign.dates}</small>
                </div>
              ))}
            </section>

            <section>
              <div className="ah-toolbar">
                <h2>Zodiac Profiles</h2>

                <div className="ah-actions">
                  <label className="ah-search">
                    <Search size={16} color="#899187" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search zodiac profile..."
                    />
                  </label>

                  <select
                    className="ah-filter"
                    value={selectedSign}
                    onChange={(e) => setSelectedSign(e.target.value)}
                  >
                    <option value="All">All Signs</option>
                    {signs.map((sign) => (
                      <option key={sign._id} value={sign.name}>
                        {sign.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ah-list">
                {filteredSigns.length > 0 ? (
                  filteredSigns.map((item) => (
                    <article className="ah-item" key={item._id}>
                      <div className="ah-item-main">
                        <div className="ah-sign-icon">{item.symbol}</div>

                        <div>
                          <div className="ah-item-meta">
                            {item.dates} · {item.element} · {item.planet}
                          </div>
                          <h3>{item.name}</h3>
                          <p>{item.about}</p>
                        </div>
                      </div>

                      <div className="ah-item-actions">
                        <span
                          className={`ah-status ${
                            item.status === "Draft" ? "draft" : ""
                          }`}
                        >
                          {item.status}
                        </span>

                        <button
                          className="ah-icon-btn"
                          title={
                            item.status === "Published"
                              ? "Unpublish"
                              : "Publish"
                          }
                          onClick={() => toggleStatus(item._id)}
                        >
                          {item.status === "Published" ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>

                        <button
                          className="ah-icon-btn"
                          title="Edit profile"
                          onClick={() => openEditForm(item)}
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="ah-empty">
                    No zodiac profiles found. Try another search or filter.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {showForm && (
        <div className="ah-overlay" onClick={closeForm}>
          <div className="ah-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ah-modal-head">
              <h2>
                Edit {signs.find((s) => s._id === editingId)?.name} Profile
              </h2>

              <button
                className="ah-close"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <p className="ah-modal-subtitle">
              Update the information displayed in the public Zodiac profile.
            </p>

            <form className="ah-form" onSubmit={handleSubmit}>
              <div className="ah-section-label">Astrological Details</div>

              <div className="ah-form-row">
                {profileFields.map((field) => (
                  <div className="ah-field" key={field.name}>
                    <label>{field.label} *</label>
                    <input
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="ah-section-label">Zodiac Characteristics</div>

              <div className="ah-field">
                <label>Personality *</label>
                <textarea
                  name="traits"
                  value={form.traits}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-field">
                <label>Strengths *</label>
                <textarea
                  name="strengths"
                  value={form.strengths}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-field">
                <label>Things to be mindful of *</label>
                <textarea
                  name="weaknesses"
                  value={form.weaknesses}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-section-label">Life & Guidance</div>

              <div className="ah-field">
                <label>Love & Relationships *</label>
                <textarea
                  name="love"
                  value={form.love}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-field">
                <label>Career & Work *</label>
                <textarea
                  name="career"
                  value={form.career}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-section-label">About This Zodiac</div>

              <div className="ah-field">
                <label>About *</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ah-field">
                <label>Publication Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="ah-form-buttons">
                <button
                  type="button"
                  className="ah-cancel"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="ah-primary"
                  disabled={saving}
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
