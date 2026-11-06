
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageIntro from "../components/PageIntro";
import Heading from "../components/Heading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Journal() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/journal/public`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load journal articles.");
        }

        setArticles(data.articles || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="inner-page journal-page">
      <PageIntro
        eyebrow="THE DIVINE CARAT JOURNAL"
        title={<>A collection of thoughts <em>for your journey.</em></>}
        desc="Take a little time for yourself with reflections, inspiration and gentle reminders."
      />

      <section className="journal section">
        <Heading
          eyebrow="READ AND REFLECT"
          title={<>Words to keep <em>close to heart.</em></>}
          desc="Explore thoughts on self-discovery, growth and new beginnings."
        />

        {loading && (
          <p className="journal-message">Loading journal articles...</p>
        )}

        {!loading && error && (
          <p className="journal-message journal-error">{error}</p>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className="journal-message">
            No published journal articles available right now.
          </p>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="journal-grid">
            {articles.map((article) => (
              <article key={article._id || article.slug}>
                <div
                  className={`journal-art ${
                    article.style || "journal-moon"
                  }`}
                ></div>

                <label>{article.category}</label>

                <h3>{article.title}</h3>

                {article.intro && (
                  <p className="journal-card-intro">{article.intro}</p>
                )}

                <Link to={`/journal/${article.slug}`}>
                  Read more <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        .journal-message {
          text-align: center;
          padding: 35px 15px;
          color: #68766a;
          font-size: 15px;
        }

        .journal-error {
          color: #a33c35;
        }

        .journal-card-intro {
          margin: 12px 0 18px;
          color: #68766a;
          font-size: 14px;
          line-height: 1.8;
        }
      `}</style>
    </main>
  );
}
