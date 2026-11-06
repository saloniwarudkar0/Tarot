
import React, { useEffect, useState } from "react";
import {
  ArrowLeft, Plus, Search, BookOpen, Pencil, Trash2,
  X, Save, Eye, FileText, Grip
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const emptySection = () => ({
  heading: "",
  text: ""
});

const emptyForm = {
  title: "",
  slug: "",
  category: "",
  style: "journal-moon",
  intro: "",
  content: [emptySection()],
  status: "Draft"
};

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function AdminJournal() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("divineCaratAdminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`
    };
  };

  const fetchArticles = async () => {
    setLoading(true);
    setPageError("");
    try {
      const response = await fetch(`${API_BASE}/api/journal`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load articles.");
      setArticles(data.articles || []);
    } catch (error) {
      setPageError(error.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    `${article.title} ${article.category} ${article.slug}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const publishedCount = articles.filter(
    (article) => article.status === "Published"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      content: [emptySection()]
    });
    setSlugManuallyEdited(false);
    setShowForm(true);
  };

  const openEditForm = (article) => {
    setEditingId(article._id);
    setForm({
      title: article.title || "",
      slug: article.slug || "",
      category: article.category || "",
      style: article.style || "journal-moon",
      intro: article.intro || "",
      content: article.content?.length
        ? article.content.map((item) => ({
            heading: item.heading || "",
            text: item.text || ""
          }))
        : [emptySection()],
      status: article.status || "Draft"
    });
    setSlugManuallyEdited(true);
    setShowForm(true);
  };

  const handleTitleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugManuallyEdited ? prev.slug : createSlug(value)
    }));
  };

  const handleSlugChange = (value) => {
    setSlugManuallyEdited(true);
    setForm((prev) => ({
      ...prev,
      slug: createSlug(value)
    }));
  };

  const updateSection = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      content: [...prev.content, emptySection()]
    }));
  };

  const removeSection = (index) => {
    setForm((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      ...emptyForm,
      content: [emptySection()]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedContent = form.content
      .map((section) => ({
        heading: section.heading.trim(),
        text: section.text.trim()
      }))
      .filter((section) => section.heading && section.text);

    if (
      !form.title.trim() ||
      !form.slug.trim() ||
      !form.category.trim() ||
      !form.intro.trim() ||
      cleanedContent.length === 0
    ) {
      window.alert(
        "Please fill all required fields and add at least one complete content section."
      );
      return;
    }

    const duplicateSlug = articles.some(
      (article) =>
        article.slug === form.slug &&
        article._id !== editingId
    );

    if (duplicateSlug) {
      window.alert("This slug already exists. Please use a different slug.");
      return;
    }

    const articleData = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      category: form.category.trim().toUpperCase(),
      style: form.style,
      intro: form.intro.trim(),
      content: cleanedContent,
      status: form.status
    };

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const response = await fetch(
        isEditing
          ? `${API_BASE}/api/journal/${editingId}`
          : `${API_BASE}/api/journal`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(articleData)
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save article.");
      await fetchArticles();
      closeForm();
    } catch (error) {
      window.alert(error.message || "Unable to save article.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/api/journal/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to delete article.");
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } catch (error) {
      window.alert(error.message || "Unable to delete article.");
    }
  };

  const toggleStatus = async (id) => {
    const article = articles.find((item) => item._id === id);
    if (!article) return;

    const status = article.status === "Published" ? "Draft" : "Published";

    try {
      const response = await fetch(`${API_BASE}/api/journal/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to update status.");
      setArticles((prev) => prev.map((item) =>
        item._id === id ? data.article : item
      ));
    } catch (error) {
      window.alert(error.message || "Unable to update status.");
    }
  };

  return (
    <div className="aj-page">
      <header className="aj-header">
        <div>
          <button className="aj-back" onClick={() => navigate("/admin")}>
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>

          <span className="aj-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Journal Management</h1>
          <p>Create and manage the stories of Divine Carat.</p>
        </div>

        <button className="aj-primary-btn" onClick={openAddForm}>
          <Plus size={18} /> New Article
        </button>
      </header>

      <section className="aj-stats">
        <div className="aj-stat">
          <span>Total Articles</span>
          <strong>{articles.length}</strong>
          <FileText size={22} />
        </div>

        <div className="aj-stat">
          <span>Published</span>
          <strong>{publishedCount}</strong>
          <Eye size={22} />
        </div>

        <div className="aj-stat">
          <span>Drafts</span>
          <strong>{articles.length - publishedCount}</strong>
          <BookOpen size={22} />
        </div>
      </section>

      {pageError && <p role="alert" style={{ color: "#a34f43", marginBottom: 18 }}>{pageError}</p>}

      <section className="aj-content">
        <div className="aj-content-heading">
          <div>
            <span className="aj-eyebrow">YOUR COLLECTION</span>
            <h2>All Journal Articles</h2>
          </div>

          <div className="aj-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="aj-table-wrap">
          <table className="aj-table">
            <thead>
              <tr>
                <th>ARTICLE</th>
                <th>CATEGORY</th>
                <th>DESIGN</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="aj-empty">Loading journal articles...</td></tr>
              ) : filteredArticles.map((article) => (
                <tr key={article._id}>
                  <td>
                    <div className="aj-article-title">
                      <div className="aj-book-icon">
                        <BookOpen size={18} />
                      </div>

                      <div>
                        <strong>{article.title}</strong>
                        <small>{article.slug}</small>
                      </div>
                    </div>
                  </td>

                  <td>{article.category}</td>

                  <td>
                    <span className="aj-style-name">
                      {article.style?.replace("journal-", "") || "Moon"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`aj-status ${
                        article.status === "Published" ? "published" : "draft"
                      }`}
                      onClick={() => toggleStatus(article._id)}
                      title="Click to change status"
                    >
                      {article.status}
                    </button>
                  </td>

                  <td>
                    <div className="aj-actions">
                      <button
                        title="Edit article"
                        onClick={() => openEditForm(article)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete article"
                        className="aj-delete"
                        onClick={() => deleteArticle(article._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredArticles.length === 0 && (
                <tr>
                  <td colSpan="5" className="aj-empty">
                    No journal articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="aj-modal-overlay">
          <div className="aj-modal">
            <div className="aj-modal-heading">
              <div>
                <span className="aj-eyebrow">JOURNAL EDITOR</span>
                <h2>{editingId ? "Edit Article" : "Create New Article"}</h2>
              </div>

              <button className="aj-close" onClick={closeForm}>
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="aj-field">
                <label>Article Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="aj-field">
                <label>Article Slug *</label>
                <input
                  value={form.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="article-url-slug"
                  required
                />
                <small className="aj-help">
                  Journal URL: /journal/{form.slug || "your-article-slug"}
                </small>
              </div>

              <div className="aj-field">
                <label>Category *</label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. SELF REFLECTION"
                  required
                />
              </div>

              <div className="aj-field">
                <label>Journal Design Style *</label>
                <div className="aj-style-options">
                  {[
                    { value: "journal-moon", label: "Moon", symbol: "☾" },
                    { value: "journal-sun", label: "Sun", symbol: "☼" },
                    { value: "journal-star", label: "Star", symbol: "✧" }
                  ].map((style) => (
                    <button
                      type="button"
                      key={style.value}
                      className={`aj-style-option ${
                        form.style === style.value ? "active" : ""
                      }`}
                      onClick={() =>
                        setForm({ ...form, style: style.value })
                      }
                    >
                      <span>{style.symbol}</span>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aj-field">
                <label>Short Intro *</label>
                <textarea
                  value={form.intro}
                  onChange={(e) =>
                    setForm({ ...form, intro: e.target.value })
                  }
                  placeholder="Write a short introduction for the article..."
                  rows="3"
                  required
                />
              </div>

              <div className="aj-section-heading">
                <div>
                  <span className="aj-eyebrow">ARTICLE BODY</span>
                  <h3>Content Sections</h3>
                  <p>Add headings and paragraphs for your article.</p>
                </div>

                <button
                  type="button"
                  className="aj-add-section"
                  onClick={addSection}
                >
                  <Plus size={15} /> Add Section
                </button>
              </div>

              <div className="aj-sections">
                {form.content.map((section, index) => (
                  <div className="aj-section-editor" key={index}>
                    <div className="aj-section-top">
                      <span>
                        <Grip size={15} />
                        SECTION {String(index + 1).padStart(2, "0")}
                      </span>

                      {form.content.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(index)}
                          title="Remove section"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="aj-field">
                      <label>Section Heading *</label>
                      <input
                        value={section.heading}
                        onChange={(e) =>
                          updateSection(index, "heading", e.target.value)
                        }
                        placeholder="Enter section heading"
                      />
                    </div>

                    <div className="aj-field">
                      <label>Paragraph *</label>
                      <textarea
                        value={section.text}
                        onChange={(e) =>
                          updateSection(index, "text", e.target.value)
                        }
                        placeholder="Write your article paragraph..."
                        rows="4"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="aj-field">
                <label>Publication Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="aj-form-actions">
                <button
                  type="button"
                  className="aj-cancel"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="aj-primary-btn" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .aj-page {
          min-height: 100vh;
          padding: 48px 6%;
          background: #f5f4ed;
          color: #263b31;
          font-family: Georgia, 'Times New Roman', serif;
        }

        .aj-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 35px;
        }

        .aj-back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border: 1px solid #d9ded3;
          border-radius: 4px;
          background: transparent;
          color: #344b3c;
          cursor: pointer;
          font: 12px Arial, sans-serif;
          margin-bottom: 25px;
          transition: all 0.25s ease;
        }

        .aj-back:hover {
          background: #304b3b;
          border-color: #304b3b;
          color: #ffffff;
        }

        .aj-eyebrow {
          display: block;
          color: #a58d5c;
          font: 10px Arial, sans-serif;
          letter-spacing: 2px;
        }

        .aj-header h1 {
          font-size: 34px;
          font-weight: normal;
          margin: 10px 0;
        }

        .aj-header p {
          color: #879084;
          font: 12px Arial, sans-serif;
        }

        .aj-primary-btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          padding: 13px 19px;
          border: 1px solid #294637;
          border-radius: 3px;
          background: #294637;
          color: #fffdf5;
          font: 12px Arial, sans-serif;
          cursor: pointer;
          transition: .2s;
        }

        .aj-primary-btn:hover {
          background: #3d5b49;
        }

        .aj-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 30px;
        }

        .aj-stat {
          position: relative;
          padding: 24px;
          border: 1px solid #e7e5da;
          background: #fffefa;
          border-radius: 4px;
        }

        .aj-stat span {
          display: block;
          color: #778477;
          font: 11px Arial, sans-serif;
        }

        .aj-stat strong {
          display: block;
          margin-top: 12px;
          font-size: 31px;
          font-weight: normal;
        }

        .aj-stat svg {
          position: absolute;
          top: 23px;
          right: 23px;
          color: #aa9362;
        }

        .aj-content {
          background: #fffefa;
          border: 1px solid #e7e5da;
          border-radius: 4px;
          padding: 28px;
        }

        .aj-content-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 25px;
        }

        .aj-content-heading h2 {
          font-size: 22px;
          font-weight: normal;
          margin: 8px 0 0;
        }

        .aj-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 240px;
          padding: 10px 12px;
          border: 1px solid #e5e4d9;
          color: #829080;
        }

        .aj-search input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          color: #314538;
          font: 11px Arial, sans-serif;
        }

        .aj-table-wrap {
          width: 100%;
          overflow-x: auto;
        }

        .aj-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 720px;
        }

        .aj-table th {
          padding: 14px 12px;
          background: #f5f5ee;
          color: #8a9285;
          font: 9px Arial, sans-serif;
          letter-spacing: 1.3px;
          white-space: nowrap;
        }

        .aj-table td {
          padding: 17px 12px;
          border-bottom: 1px solid #eeede5;
          color: #778176;
          font: 11px Arial, sans-serif;
        }

        .aj-article-title {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 250px;
        }

        .aj-book-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          background: #edf0e7;
          color: #75886d;
        }

        .aj-article-title strong {
          display: block;
          color: #304536;
          font: 13px Georgia, serif;
          margin-bottom: 5px;
        }

        .aj-article-title small {
          display: block;
          max-width: 280px;
          color: #92998e;
          font-size: 10px;
          line-height: 1.5;
        }

        .aj-style-name {
          text-transform: capitalize;
          color: #718071;
        }

        .aj-status {
          border: 0;
          border-radius: 20px;
          padding: 7px 11px;
          font: 10px Arial, sans-serif;
          cursor: pointer;
        }

        .aj-status.published {
          background: #e7efe5;
          color: #55744f;
        }

        .aj-status.draft {
          background: #f3eee1;
          color: #967b45;
        }

        .aj-actions {
          display: flex;
          gap: 8px;
        }

        .aj-actions button {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid #e8e6dc;
          background: #fffefa;
          color: #718071;
          cursor: pointer;
        }

        .aj-actions .aj-delete {
          color: #a56d60;
        }

        .aj-empty {
          text-align: center;
          padding: 35px !important;
        }

        .aj-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(24, 40, 31, .55);
        }

        .aj-modal {
          width: min(100%, 650px);
          max-height: 90vh;
          overflow-y: auto;
          padding: 30px;
          background: #fffefa;
          border: 1px solid #e4e0d2;
          box-shadow: 0 20px 60px rgba(0,0,0,.15);
        }

        .aj-modal-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 25px;
        }

        .aj-modal-heading h2 {
          font-size: 24px;
          font-weight: normal;
          margin: 8px 0 0;
        }

        .aj-close {
          border: 0;
          background: transparent;
          color: #69796c;
          cursor: pointer;
        }

        .aj-field {
          margin-top: 18px;
        }

        .aj-modal form label {
          display: block;
          margin: 0 0 8px;
          color: #536454;
          font: 11px Arial, sans-serif;
        }

        .aj-modal form input,
        .aj-modal form textarea,
        .aj-modal form select {
          box-sizing: border-box;
          width: 100%;
          padding: 12px;
          border: 1px solid #e3e3d9;
          outline: none;
          background: #fffefa;
          color: #304536;
          font: 12px Arial, sans-serif;
        }

        .aj-modal form input:focus,
        .aj-modal form textarea:focus,
        .aj-modal form select:focus {
          border-color: #9aab91;
        }

        .aj-modal form textarea {
          resize: vertical;
          line-height: 1.6;
        }

        .aj-help {
          display: block;
          margin-top: 7px;
          color: #999c90;
          font: 10px Arial, sans-serif;
        }

        .aj-style-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .aj-style-option {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          padding: 13px;
          border: 1px solid #e5e4d9;
          background: #fffefa;
          color: #667568;
          cursor: pointer;
          font: 12px Arial, sans-serif;
        }

        .aj-style-option span {
          font-size: 20px;
          color: #a58d5c;
        }

        .aj-style-option.active {
          border-color: #526e57;
          background: #edf1e9;
          color: #294637;
        }

        .aj-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-top: 32px;
          padding-bottom: 17px;
          border-bottom: 1px solid #e9e7dc;
        }

        .aj-section-heading h3 {
          margin: 7px 0 4px;
          font: normal 20px Georgia, serif;
          color: #304536;
        }

        .aj-section-heading p {
          margin: 0;
          color: #92998e;
          font: 11px Arial, sans-serif;
        }

        .aj-add-section {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          border: 1px solid #dfe3d8;
          background: #f5f6ef;
          color: #526b54;
          cursor: pointer;
          white-space: nowrap;
          font: 11px Arial, sans-serif;
        }

        .aj-section-editor {
          margin-top: 17px;
          padding: 18px;
          border: 1px solid #e8e6dc;
          background: #fafaf5;
        }

        .aj-section-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }

        .aj-section-top span {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #a18c61;
          font: 10px Arial, sans-serif;
          letter-spacing: 1.2px;
        }

        .aj-section-top button {
          display: grid;
          place-items: center;
          width: 29px;
          height: 29px;
          border: 1px solid #e9ded8;
          background: #fffefa;
          color: #a56d60;
          cursor: pointer;
        }

        .aj-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #eeede5;
        }

        .aj-cancel {
          padding: 12px 18px;
          border: 1px solid #deded3;
          background: transparent;
          color: #667366;
          cursor: pointer;
          font: 12px Arial, sans-serif;
        }

        @media(max-width:700px) {
          .aj-page { padding: 28px 16px; }
          .aj-header { align-items: flex-start; flex-direction: column; }
          .aj-header h1 { font-size: 28px; }
          .aj-stats { grid-template-columns: 1fr; }
          .aj-content { padding: 18px 12px; }
          .aj-content-heading { align-items: flex-start; flex-direction: column; }
          .aj-search { width: 100%; box-sizing: border-box; }
          .aj-modal { padding: 22px; }
          .aj-style-options { gap: 6px; }
          .aj-style-option { padding: 10px 5px; }
          .aj-section-heading { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
