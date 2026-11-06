
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PageIntro from "../components/PageIntro";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JournalDetail() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/journal/public`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load journal article.");
        }

        const foundArticle = (data.articles || []).find(
          (item) => item.slug === slug
        );

        setArticle(foundArticle || null);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="inner-page">
        <section className="section">
          <p>Loading journal article...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="inner-page">
        <section className="section">
          <h2>Unable to load article.</h2>
          <p>{error}</p>
          <Link to="/journal">Back to Journal</Link>
        </section>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="inner-page">
        <section className="section">
          <h2>Journal article not found.</h2>
          <Link to="/journal">Back to Journal</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="inner-page journal-detail-page">
      <PageIntro
        eyebrow={article.category}
        title={<>{article.title}</>}
        desc={article.intro}
      />

      <section className="journal-detail section">
        <div className="journal-thought-grid">
          {article.content.map((item, index) => (
            <article className="journal-thought-tile" key={index}>
              <span className="thought-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="thought-decoration">✧</div>

              <h2>{item.heading}</h2>

              <p>{item.text}</p>

              <span className="thought-bottom-symbol">✦</span>
            </article>
          ))}
        </div>

        <Link className="journal-back-link" to="/journal">
          <ArrowLeft size={16} />
          Back to Journal
        </Link>
      </section>
    </main>
  );
}
