
import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, LoaderCircle, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialData = {
  story: {
    label: "",
    heading: "",
    paragraphOne: "",
    paragraphTwo: "",
  },
  philosophy: {
    label: "",
    heading: "",
    description: "",
    values: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  },
  approach: {
    label: "",
    heading: "",
    description: "",
  },
  promise: {
    label: "",
    heading: "",
    description: "",
  },
  closingQuote: "",
};

export default function AdminAbout() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("divineCaratAdminToken");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/about`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load About page.");
        }

        setForm({
          ...initialData,
          ...result.about,
          story: {
            ...initialData.story,
            ...result.about.story,
          },
          philosophy: {
            ...initialData.philosophy,
            ...result.about.philosophy,
            values:
              result.about.philosophy?.values?.length === 3
                ? result.about.philosophy.values
                : initialData.philosophy.values,
          },
          approach: {
            ...initialData.approach,
            ...result.about.approach,
          },
          promise: {
            ...initialData.promise,
            ...result.about.promise,
          },
        });
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAbout();
    } else {
      setError("Admin login required. Please log in again.");
      setLoading(false);
    }
  }, [token]);

  const updateSection = (section, field, value) => {
    setForm((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  const updateValue = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      philosophy: {
        ...previous.philosophy,
        values: previous.philosophy.values.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/api/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save About page.");
      }

      setMessage("About page updated successfully!");
      if (result.about) {
        setForm((previous) => ({
          ...previous,
          ...result.about,
        }));
      }
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const inputField = (label, value, onChange, multiline = false) => (
    <label className="about-admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );

  if (loading) {
    return (
      <div className="about-admin-loading">
        <LoaderCircle className="about-admin-spinner" size={28} />
        <p>Loading About page content...</p>
      </div>
    );
  }

  return (
    <div className="about-admin-page">
      <style>{`
        .about-admin-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 30px;
          color: #253c32;
        }

        .about-admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .about-admin-heading h1 {
          margin: 0 0 7px;
          font-family: Georgia, serif;
          font-size: 32px;
          font-weight: 500;
        }

        .about-admin-heading p {
          margin: 0;
          color: #78857d;
          font-size: 14px;
        }

        .about-admin-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .about-admin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #d9e0d9;
          border-radius: 7px;
          padding: 11px 17px;
          background: #fff;
          color: #344a3e;
          cursor: pointer;
          font-size: 13px;
        }

        .about-admin-btn.save {
          background: #294b3b;
          border-color: #294b3b;
          color: white;
        }

        .about-admin-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .about-admin-section {
          padding: 25px;
          margin-bottom: 20px;
          background: #fff;
          border: 1px solid #e5e9e3;
          border-radius: 10px;
        }

        .about-admin-section h2 {
          margin: 0 0 6px;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 500;
        }

        .about-admin-section > p {
          margin: 0 0 22px;
          color: #89938c;
          font-size: 13px;
        }

        .about-admin-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .about-admin-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 17px;
        }

        .about-admin-field span {
          color: #526257;
          font-size: 12px;
          font-weight: 600;
        }

        .about-admin-field input,
        .about-admin-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border: 1px solid #dce3dc;
          border-radius: 6px;
          outline: none;
          background: #fcfdfb;
          color: #304237;
          font: inherit;
          font-size: 14px;
          resize: vertical;
        }

        .about-admin-field input:focus,
        .about-admin-field textarea:focus {
          border-color: #789783;
          box-shadow: 0 0 0 3px rgba(120, 151, 131, .12);
        }

        .about-admin-value {
          padding: 18px;
          margin-top: 15px;
          border: 1px solid #e7ebe5;
          border-radius: 8px;
          background: #fafbf8;
        }

        .about-admin-value h3 {
          margin: 0 0 15px;
          color: #63776a;
          font-size: 13px;
          font-weight: 600;
        }

        .about-admin-alert {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 15px;
          margin-bottom: 20px;
          border-radius: 7px;
          font-size: 13px;
        }

        .about-admin-alert.success {
          color: #27633f;
          background: #edf7ef;
        }

        .about-admin-alert.error {
          color: #a13d36;
          background: #fff0ee;
        }

        .about-admin-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #63776a;
        }

        .about-admin-spinner {
          animation: aboutSpin 1s linear infinite;
        }

        @keyframes aboutSpin {
          to { transform: rotate(360deg); }
        }

        .about-admin-bottom {
          display: flex;
          justify-content: flex-end;
          padding: 10px 0 30px;
        }

        @media (max-width: 650px) {
          .about-admin-page { padding: 18px 13px; }
          .about-admin-heading h1 { font-size: 27px; }
          .about-admin-section { padding: 18px 14px; }
          .about-admin-grid { grid-template-columns: 1fr; gap: 0; }
          .about-admin-actions { width: 100%; }
          .about-admin-btn { flex: 1; }
        }
      `}</style>

      <div className="about-admin-header">
        <div className="about-admin-heading">
          <h1>About Page</h1>
          <p>Edit the content displayed on your public About page.</p>
        </div>

        <div className="about-admin-actions">
          <button
            type="button"
            className="about-admin-btn"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          <button
            type="button"
            className="about-admin-btn save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <LoaderCircle size={16} className="about-admin-spinner" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && (
        <div className="about-admin-alert success">
          <CheckCircle size={17} />
          {message}
        </div>
      )}

      {error && (
        <div className="about-admin-alert error">
          <AlertCircle size={17} />
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <section className="about-admin-section">
          <h2>Our Story</h2>
          <p>Edit the story section of your About page.</p>

          {inputField("Section Label", form.story.label, (v) =>
            updateSection("story", "label", v)
          )}

          {inputField("Heading", form.story.heading, (v) =>
            updateSection("story", "heading", v)
          )}

          {inputField("First Paragraph", form.story.paragraphOne, (v) =>
            updateSection("story", "paragraphOne", v), true
          )}

          {inputField("Second Paragraph", form.story.paragraphTwo, (v) =>
            updateSection("story", "paragraphTwo", v), true
          )}

          <p>Current About image: /images/antique-tarot.jpg (unchanged)</p>
        </section>

        <section className="about-admin-section">
          <h2>Our Philosophy</h2>
          <p>Edit the philosophy heading and the three belief cards.</p>

          {inputField("Section Label", form.philosophy.label, (v) =>
            updateSection("philosophy", "label", v)
          )}

          {inputField("Heading", form.philosophy.heading, (v) =>
            updateSection("philosophy", "heading", v)
          )}

          {inputField("Description", form.philosophy.description, (v) =>
            updateSection("philosophy", "description", v), true
          )}

          {form.philosophy.values.map((item, index) => (
            <div className="about-admin-value" key={index}>
              <h3>Belief Card {index + 1}</h3>

              {inputField("Title", item.title, (v) =>
                updateValue(index, "title", v)
              )}

              {inputField("Description", item.description, (v) =>
                updateValue(index, "description", v), true
              )}
            </div>
          ))}
        </section>

        <section className="about-admin-section">
          <h2>Our Approach</h2>
          <p>Edit the approach section.</p>

          {inputField("Section Label", form.approach.label, (v) =>
            updateSection("approach", "label", v)
          )}

          {inputField("Heading", form.approach.heading, (v) =>
            updateSection("approach", "heading", v)
          )}

          {inputField("Description", form.approach.description, (v) =>
            updateSection("approach", "description", v), true
          )}
        </section>

        <section className="about-admin-section">
          <h2>Our Promise</h2>
          <p>Edit the closing note from Divine Carat.</p>

          {inputField("Section Label", form.promise.label, (v) =>
            updateSection("promise", "label", v)
          )}

          {inputField("Heading", form.promise.heading, (v) =>
            updateSection("promise", "heading", v)
          )}

          {inputField("Description", form.promise.description, (v) =>
            updateSection("promise", "description", v), true
          )}
        </section>

        <section className="about-admin-section">
          <h2>Closing Quote</h2>
          <p>Edit the quote displayed at the bottom of the About page.</p>

          {inputField("Quote", form.closingQuote, (v) =>
            setForm((previous) => ({
              ...previous,
              closingQuote: v,
            }))
          )}
        </section>

        <div className="about-admin-bottom">
          <button
            type="submit"
            className="about-admin-btn save"
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save About Page"}
          </button>
        </div>
      </form>
    </div>
  );
}
