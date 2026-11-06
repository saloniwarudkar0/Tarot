
import { useEffect, useState } from "react";
import PageIntro from "../components/PageIntro";
import Heading from "../components/Heading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Zodiac() {
  const [zodiacSigns, setZodiacSigns] = useState([]);
  const [selectedSign, setSelectedSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchZodiacSigns = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/zodiac/public`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load zodiac signs.");
        }

        setZodiacSigns(data.signs || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchZodiacSigns();
  }, []);

  return (
    <main className="inner-page zodiac-page">
      <PageIntro
        eyebrow="ASTROLOGY"
        title={<>A little guidance from <em>the stars.</em></>}
        desc="Explore the twelve zodiac signs and learn about the qualities traditionally associated with each one."
      />

      <section className="zodiac zodiac-section section">
        <Heading
          eyebrow="THE TWELVE SIGNS"
          title={<>Which sign speaks <em>to you?</em></>}
          desc="Choose a zodiac sign to discover its personality, strengths and more."
        />

        {loading && (
          <p className="zodiac-message">Loading zodiac signs...</p>
        )}

        {!loading && error && (
          <p className="zodiac-message zodiac-error">{error}</p>
        )}

        {!loading && !error && zodiacSigns.length === 0 && (
          <p className="zodiac-message">
            No zodiac signs available right now.
          </p>
        )}

        {!loading && !error && zodiacSigns.length > 0 && (
          <div className="signs zodiac-signs">
            {zodiacSigns.map((sign, index) => (
              <button
                className={`zodiac-card zodiac-card-${index % 4}`}
                key={sign._id || sign.slug}
                onClick={() => setSelectedSign(sign)}
                aria-label={`Explore ${sign.name}`}
              >
                <span className="zodiac-symbol">{sign.symbol}</span>
                <span className="zodiac-name">{sign.name}</span>
                <span className="zodiac-dates">{sign.dates}</span>
                <span className="zodiac-explore">EXPLORE ✧</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="quote zodiac-quote">
        <p>
          <span className="zodiac-quote-white">
            Look to the stars, and always{" "}
          </span>
          <em>stay curious.</em>
        </p>
      </section>

      {selectedSign && (
        <div
          className="zodiac-modal-overlay"
          onClick={() => setSelectedSign(null)}
        >
          <div
            className="zodiac-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedSign.name} zodiac details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="zodiac-modal-close"
              onClick={() => setSelectedSign(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="zodiac-modal-symbol">{selectedSign.symbol}</div>

            <span className="zodiac-modal-eyebrow">
              DISCOVER YOUR ZODIAC
            </span>

            <h2>{selectedSign.name}</h2>
            <p className="zodiac-modal-dates">{selectedSign.dates}</p>

            <p className="zodiac-modal-about">{selectedSign.about}</p>

            <div className="zodiac-facts">
              <div>
                <small>ELEMENT</small>
                <strong>{selectedSign.element}</strong>
              </div>
              <div>
                <small>RULING PLANET</small>
                <strong>{selectedSign.planet}</strong>
              </div>
              <div>
                <small>QUALITY</small>
                <strong>{selectedSign.quality}</strong>
              </div>
              <div>
                <small>ASSOCIATED COLOUR</small>
                <strong>{selectedSign.color}</strong>
              </div>
            </div>

            <div className="zodiac-detail-block">
              <h3>Personality</h3>
              <p>{selectedSign.traits}</p>
            </div>

            <div className="zodiac-detail-block">
              <h3>Strengths</h3>
              <p>{selectedSign.strengths}</p>
            </div>

            <div className="zodiac-detail-block">
              <h3>Things to be mindful of</h3>
              <p>{selectedSign.weaknesses}</p>
            </div>

            <div className="zodiac-detail-block">
              <h3>Love & Relationships</h3>
              <p>{selectedSign.love}</p>
            </div>

            <div className="zodiac-detail-block">
              <h3>Career & Work</h3>
              <p>{selectedSign.career}</p>
            </div>

            <button
              className="zodiac-modal-button"
              onClick={() => setSelectedSign(null)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <style>{`
        .zodiac-message {
          text-align: center;
          padding: 35px 15px;
          color: #68766a;
          font-size: 15px;
        }

        .zodiac-error {
          color: #a33c35;
        }
      `}</style>
    </main>
  );
}
