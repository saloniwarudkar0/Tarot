
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Eye,
  EyeOff,
  Save,
  Sun,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  cardName: "",
  subtitle: "",
  interpretation: "",
  guidance: "",
  status: "Draft",
};

export default function AdminTarot() {
  const navigate = useNavigate();

  const [readings, setReadings] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("divineCaratAdminToken");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // Fetch readings from MongoDB
  const fetchReadings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/tarot`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("divineCaratAdminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load tarot readings.");
      }

      setReadings(data.readings || []);
    } catch (err) {
      console.error("Fetch Tarot Error:", err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const published = readings.filter(
    (item) => item.status === "Published"
  ).length;

  const drafts = readings.filter(
    (item) => item.status === "Draft"
  ).length;

  const filteredReadings = readings.filter((item) =>
    `${item.cardName} ${item.subtitle} ${item.date}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
    setError("");
  };

  const openEditForm = (reading) => {
    setEditingId(reading._id);
    setForm({
      date: reading.date || "",
      cardName: reading.cardName || "",
      subtitle: reading.subtitle || "",
      interpretation: reading.interpretation || "",
      guidance: reading.guidance || "",
      status: reading.status || "Draft",
    });
    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or update reading in MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.date ||
      !form.cardName.trim() ||
      !form.interpretation.trim() ||
      !form.guidance.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = editingId !== null;
      const url = isEditing
        ? `${API_URL}/api/tarot/${editingId}`
        : `${API_URL}/api/tarot`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("divineCaratAdminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save reading.");
      }

      await fetchReadings();
      closeForm();
      alert(
        isEditing
          ? "Tarot reading updated successfully."
          : "Tarot reading added successfully."
      );
    } catch (err) {
      console.error("Save Tarot Error:", err);
      setError(err.message || "Unable to save reading.");
      alert(err.message || "Unable to save reading.");
    } finally {
      setSaving(false);
    }
  };

  // Delete reading from MongoDB
  const deleteReading = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/api/tarot/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("divineCaratAdminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete reading.");
      }

      setReadings((prev) => prev.filter((item) => item._id !== id));
      alert("Tarot reading deleted successfully.");
    } catch (err) {
      console.error("Delete Tarot Error:", err);
      setError(err.message || "Unable to delete reading.");
      alert(err.message || "Unable to delete reading.");
    }
  };

  // Publish / Unpublish reading in MongoDB
  const toggleStatus = async (reading) => {
    const newStatus =
      reading.status === "Published" ? "Draft" : "Published";

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/tarot/${reading._id}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("divineCaratAdminToken");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update status.");
      }

      setReadings((prev) =>
        prev.map((item) =>
          item._id === reading._id
            ? { ...item, status: data.reading.status }
            : item
        )
      );
    } catch (err) {
      console.error("Tarot Status Error:", err);
      setError(err.message || "Unable to update status.");
      alert(err.message || "Unable to update status.");
    }
  };

  return (
    <div className="at-page">
      <style>{`
        .at-page {
          min-height: 100vh;
          background: #f7f6f0;
          color: #263b30;
          padding: 38px 5%;
          font-family: Georgia, serif;
        }
        .at-container { max-width: 1180px; margin: auto; }
        .at-top {
          display: flex; justify-content: space-between;
          align-items: center; gap: 16px; margin-bottom: 42px;
        }
        .at-back {
          border: 1px solid #d9ded3; background: transparent;
          padding: 11px 16px; border-radius: 4px;
          color: #344b3c; cursor: pointer; display: flex;
          align-items: center; gap: 8px; font-size: 13px;
        }
        .at-brand { font-size: 17px; letter-spacing: 3px; font-weight: bold; }
        .at-brand small {
          display: block; font: 9px Arial, sans-serif;
          letter-spacing: 3px; color: #9a8455; margin-top: 6px;
        }
        .at-heading { margin-bottom: 28px; }
        .at-eyebrow {
          color: #a48c59; font: 10px Arial, sans-serif;
          letter-spacing: 3px; text-transform: uppercase;
        }
        .at-heading h1 {
          font-size: clamp(32px, 5vw, 46px);
          font-weight: 400; margin: 12px 0 8px;
        }
        .at-heading p {
          color: #7d897e; font: 13px Arial, sans-serif;
          line-height: 1.7;
        }
        .at-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 30px;
        }
        .at-stat {
          background: #fff; border: 1px solid #e8e8df;
          padding: 22px; border-radius: 5px;
        }
        .at-stat span {
          color: #879084; font: 10px Arial, sans-serif;
          letter-spacing: 1.5px; text-transform: uppercase;
        }
        .at-stat strong {
          display: block; font-size: 30px; font-weight: 400;
          margin-top: 12px;
        }
        .at-toolbar {
          display: flex; justify-content: space-between;
          align-items: center; gap: 14px; margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .at-toolbar h2 { font-size: 23px; font-weight: 400; margin: 0; }
        .at-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .at-search {
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e3e5dc;
          padding: 0 12px; min-width: 220px; border-radius: 4px;
        }
        .at-search input {
          border: 0; outline: 0; padding: 12px 0;
          width: 100%; background: transparent; font-size: 13px;
        }
        .at-primary {
          display: flex; align-items: center; gap: 8px;
          background: #304b3b; color: white; border: 0;
          padding: 12px 17px; border-radius: 4px;
          cursor: pointer; font-size: 12px;
        }
        .at-primary:disabled {
          opacity: .6; cursor: not-allowed;
        }
        .at-list { display: grid; gap: 14px; }
        .at-item {
          background: #fff; border: 1px solid #e7e8df;
          border-radius: 5px; padding: 22px;
          display: flex; justify-content: space-between;
          align-items: center; gap: 20px;
        }
        .at-item-main { display: flex; align-items: center; gap: 18px; }
        .at-icon {
          width: 54px; height: 54px; flex-shrink: 0;
          border-radius: 50%; background: #edf0e8;
          display: grid; place-items: center; color: #a38b57;
        }
        .at-item h3 { font-size: 20px; font-weight: 400; margin: 0 0 6px; }
        .at-item p {
          font: 11px Arial, sans-serif; color: #899187; margin: 0;
        }
        .at-date {
          display: block; color: #a18a5c;
          font: 10px Arial, sans-serif; margin-bottom: 7px;
        }
        .at-item-actions { display: flex; align-items: center; gap: 8px; }
        .at-status {
          border-radius: 20px; padding: 6px 11px;
          font: 10px Arial, sans-serif;
          background: #edf3eb; color: #527251;
        }
        .at-status.draft { background: #f5f0e5; color: #9a7940; }
        .at-icon-btn {
          width: 35px; height: 35px; display: grid;
          place-items: center; border: 1px solid #e5e7df;
          background: #fff; color: #526354; border-radius: 4px;
          cursor: pointer;
        }
        .at-icon-btn:hover { background: #f0f2eb; }
        .at-delete { color: #a45e57; }
        .at-empty {
          padding: 55px 20px; text-align: center;
          background: white; border: 1px solid #e7e8df;
          color: #899187; font: 13px Arial, sans-serif;
        }
        .at-message {
          padding: 13px 16px; margin-bottom: 18px;
          border: 1px solid #e5d8c4; background: #fffaf0;
          color: #8b6840; font: 13px Arial, sans-serif;
          line-height: 1.6; border-radius: 4px;
        }
        .at-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(24, 37, 29, .55);
          display: grid; place-items: center; padding: 18px;
          overflow-y: auto;
        }
        .at-modal {
          width: 100%; max-width: 650px; background: #fff;
          padding: 30px; border-radius: 6px;
          max-height: 92vh; overflow-y: auto;
        }
        .at-modal-head {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 24px;
        }
        .at-modal-head h2 { font-size: 26px; font-weight: 400; margin: 0; }
        .at-close {
          border: 0; background: transparent; cursor: pointer;
          color: #536454;
        }
        .at-form { display: grid; gap: 17px; }
        .at-field { display: grid; gap: 8px; }
        .at-field label {
          font: 10px Arial, sans-serif; letter-spacing: 1px;
          color: #667367; text-transform: uppercase;
        }
        .at-field input, .at-field textarea, .at-field select {
          width: 100%; box-sizing: border-box;
          border: 1px solid #dfe3d9; border-radius: 3px;
          padding: 12px; outline: none; background: #fff;
          color: #34483a; font: 13px Arial, sans-serif;
        }
        .at-field textarea { min-height: 105px; resize: vertical; line-height: 1.6; }
        .at-field input:focus, .at-field textarea:focus,
        .at-field select:focus { border-color: #8d9b84; }
        .at-form-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        .at-form-buttons {
          display: flex; justify-content: flex-end;
          gap: 10px; margin-top: 8px;
        }
        .at-cancel {
          border: 1px solid #dfe3d9; background: white;
          padding: 12px 18px; border-radius: 4px;
          cursor: pointer; color: #536454;
        }
        @media(max-width:650px) {
          .at-page { padding: 24px 5%; }
          .at-top { margin-bottom: 30px; }
          .at-stats { gap: 8px; }
          .at-stat { padding: 14px; }
          .at-stat strong { font-size: 24px; }
          .at-item { align-items: flex-start; flex-direction: column; }
          .at-item-actions { width: 100%; justify-content: flex-end; }
          .at-form-row { grid-template-columns: 1fr; }
          .at-modal { padding: 22px; }
        }
      `}</style>

      <div className="at-container">
        <header className="at-top">
          <button className="at-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={15} /> Back to Dashboard
          </button>

          <div className="at-brand">
            DIVINE CARAT
            <small>ADMIN STUDIO</small>
          </div>
        </header>

        <section className="at-heading">
          <span className="at-eyebrow">Content Management</span>
          <h1>Daily Tarot</h1>
          <p>Manage the daily card, its message and guidance for your readers.</p>
        </section>

        {error && <div className="at-message">{error}</div>}

        <section className="at-stats">
          <div className="at-stat">
            <span>Total Readings</span>
            <strong>{readings.length}</strong>
          </div>
          <div className="at-stat">
            <span>Published</span>
            <strong>{published}</strong>
          </div>
          <div className="at-stat">
            <span>Drafts</span>
            <strong>{drafts}</strong>
          </div>
        </section>

        <section>
          <div className="at-toolbar">
            <h2>Tarot Readings</h2>

            <div className="at-actions">
              <label className="at-search">
                <Search size={16} color="#899187" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search readings..."
                />
              </label>

              <button className="at-primary" onClick={openAddForm}>
                <Plus size={16} /> Add Reading
              </button>
            </div>
          </div>

          <div className="at-list">
            {loading ? (
              <div className="at-empty">Loading tarot readings...</div>
            ) : filteredReadings.length ? (
              filteredReadings.map((reading) => (
                <article className="at-item" key={reading._id}>
                  <div className="at-item-main">
                    <div className="at-icon">
                      <Sun size={25} />
                    </div>

                    <div>
                      <span className="at-date">
                        <CalendarDays
                          size={11}
                          style={{ display: "inline", marginRight: 5 }}
                        />
                        {reading.date}
                      </span>

                      <h3>{reading.cardName}</h3>
                      <p>{reading.subtitle || "Daily tarot reading"}</p>
                    </div>
                  </div>

                  <div className="at-item-actions">
                    <span
                      className={`at-status ${
                        reading.status === "Draft" ? "draft" : ""
                      }`}
                    >
                      {reading.status}
                    </span>

                    <button
                      className="at-icon-btn"
                      title={
                        reading.status === "Published"
                          ? "Unpublish"
                          : "Publish"
                      }
                      onClick={() => toggleStatus(reading)}
                    >
                      {reading.status === "Published" ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>

                    <button
                      className="at-icon-btn"
                      title="Edit"
                      onClick={() => openEditForm(reading)}
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      className="at-icon-btn at-delete"
                      title="Delete"
                      onClick={() => deleteReading(reading._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="at-empty">No tarot readings found.</div>
            )}
          </div>
        </section>
      </div>

      {showForm && (
        <div className="at-overlay">
          <div className="at-modal">
            <div className="at-modal-head">
              <h2>
                {editingId ? "Edit Reading" : "Add Daily Reading"}
              </h2>

              <button className="at-close" onClick={closeForm}>
                <X size={21} />
              </button>
            </div>

            <form className="at-form" onSubmit={handleSubmit}>
              <div className="at-form-row">
                <div className="at-field">
                  <label>Reading Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="at-field">
                  <label>Card Name *</label>
                  <input
                    name="cardName"
                    value={form.cardName}
                    onChange={handleChange}
                    placeholder="e.g. The Moon"
                    required
                  />
                </div>
              </div>

              <div className="at-field">
                <label>Card Subtitle</label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Intuition • Reflection • Mystery"
                />
              </div>

              <div className="at-field">
                <label>Interpretation *</label>
                <textarea
                  name="interpretation"
                  value={form.interpretation}
                  onChange={handleChange}
                  placeholder="Write the meaning of today's tarot card..."
                  required
                />
              </div>

              <div className="at-field">
                <label>Guidance *</label>
                <textarea
                  name="guidance"
                  value={form.guidance}
                  onChange={handleChange}
                  placeholder="Write a practical message for readers..."
                  required
                />
              </div>

              <div className="at-field">
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

              <div className="at-form-buttons">
                <button
                  type="button"
                  className="at-cancel"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="at-primary"
                  disabled={saving}
                >
                  <Save size={15} />
                  {saving ? "Saving..." : "Save Reading"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
