
import { useEffect, useState } from "react";
import { Sparkles, CalendarDays } from "lucide-react";

import PageIntro from "../components/PageIntro";
import Heading from "../components/Heading";
import Button from "../components/Button";
import BookingSection from "../components/BookingSection";
import { services } from "../data/websiteData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function Tarot() {
  const [dailyReadings, setDailyReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDailyReadings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/tarot/public`);

        if (!response.ok) {
          throw new Error("Unable to load daily tarot readings.");
        }

        const data = await response.json();

        setDailyReadings(
          data.success && Array.isArray(data.readings)
            ? data.readings
            : []
        );
      } catch (err) {
        console.error("Daily Tarot Error:", err);
        setError(
          "Daily Tarot is temporarily unavailable. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDailyReadings();
  }, []);

  return (
    <main className="inner-page tarot-page">
      <PageIntro
        eyebrow="TAROT READINGS"
        title={<>Find clarity in <em>every chapter.</em></>}
        desc="Explore thoughtful readings designed to help you pause, reflect and reconnect with yourself."
      />

      {/* DAILY TAROT SECTION */}
      <section className="daily-tarot-section section">
        <div className="daily-tarot-heading">
          <Heading
            eyebrow="YOUR DAILY GUIDANCE"
            title={<>The card of <em>the day.</em></>}
            desc="A gentle message to guide your thoughts, intentions and journey."
          />
        </div>

        {loading ? (
          <div className="daily-tarot-message">
            <Sparkles size={24} />
            <p>Discovering your daily guidance...</p>
          </div>
        ) : error ? (
          <div className="daily-tarot-message daily-tarot-error">
            <p>{error}</p>
          </div>
        ) : dailyReadings.length === 0 ? (
          <div className="daily-tarot-message">
            <Sparkles size={24} />
            <p>A new daily reading will be available soon.</p>
          </div>
        ) : (
          <div className="daily-tarot-list">
            {dailyReadings.map((reading, index) => (
              <article
                className={`daily-tarot-card ${
                  index === 0 ? "daily-tarot-featured" : ""
                }`}
                key={reading._id}
              >
                {/* UNIVERSAL CRYSTAL BALL IMAGE */}
                <div className="daily-tarot-art">
                  <img
                    src="/images/crystal-ball.jpg"
                    alt="Mystical crystal ball surrounded by celestial stars"
                    className="daily-tarot-image"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="daily-tarot-content">
                  <span className="daily-tarot-eyebrow">
                    <Sparkles size={13} />
                    {index === 0
                      ? "LATEST READING"
                      : "DAILY TAROT READING"}
                  </span>

                  <h3>{reading.cardName}</h3>

                  {reading.subtitle && (
                    <p className="daily-tarot-subtitle">
                      {reading.subtitle}
                    </p>
                  )}

                  <div className="daily-tarot-date">
                    <CalendarDays size={14} />
                    {formatDate(reading.date)}
                  </div>

                  <div className="daily-tarot-divider" />

                  <div className="daily-tarot-text">
                    <h4>Interpretation</h4>
                    <p>{reading.interpretation}</p>
                  </div>

                  <div className="daily-tarot-guidance">
                    <span>YOUR GENTLE REMINDER</span>
                    <p>{reading.guidance}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* TAROT SERVICES */}
      <section className="tarot-services section organic-brush">
        <div className="tarot-heading">
          <Heading
            eyebrow="CHOOSE YOUR READING"
            title={<>A space for what <em>matters to you.</em></>}
            desc="Every reading offers a moment for reflection and a fresh perspective."
          />
        </div>

        <div className="tarot-cards">
          {services.map((service, index) => (
            <article
              className={`tarot-card tarot-card-${(index % 4) + 1}`}
              key={service.title}
            >
              <span className="tarot-number">
                0{index + 1}
              </span>

              <div className="tarot-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.desc}</p>

              <Button>Book this reading</Button>
            </article>
          ))}
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="tarot-quote organic-wave">
        <span className="tarot-quote-symbol">✧</span>

        <p>
          Let curiosity guide you toward{" "}
          <em>new perspectives.</em>
        </p>

        <small>YOUR JOURNEY • YOUR DISCOVERY</small>
      </section>

      {/* BOOKING SECTION */}
      <BookingSection />

      {/* TAROT PAGE STYLES */}
      <style>{`
        .daily-tarot-section {
          padding: 95px 7%;
          background: #f5f4ed;
          color: #304536;
        }

        .daily-tarot-heading {
          text-align: center;
          margin-bottom: 55px;
        }

        .daily-tarot-list {
          max-width: 1050px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .daily-tarot-card {
          background: #fbfaf5;
          border: 1px solid rgba(91, 112, 83, 0.18);
          padding: 30px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .daily-tarot-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(47, 66, 49, 0.08);
        }

      .daily-tarot-featured {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 45px;
  padding: 45px;

  position: relative;
  border: 3px solid transparent;
  border-radius: 28px;

  background:
    linear-gradient(#fbfaf5, #fbfaf5) padding-box,
    repeating-linear-gradient(
      135deg,
      #526b50 0px,
      #526b50 5px,
      #829276 5px,
      #829276 10px
    ) border-box;

  box-shadow: 0 12px 35px rgba(48, 69, 54, 0.08);
}

/* Decorative inner wavy frame */
.daily-tarot-featured::before {
  content: "";
  position: absolute;
  inset: 8px;
  border: 1px dashed rgba(82, 107, 80, 0.45);
  border-radius: 21px;
  pointer-events: none;
}

@media (max-width: 750px) {
  .daily-tarot-featured {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 25px;
  }
}

        .daily-tarot-art {
          min-height: 320px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #e9ebdf;
          overflow: hidden;
        }

        .daily-tarot-image {
          display: block;
          width: 100%;
          height: 100%;
          min-height: 320px;
          object-fit: cover;
          object-position: center;
        }

        .daily-tarot-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9a8354;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .daily-tarot-content h3 {
          margin: 17px 0 8px;
          color: #344638;
          font-family: Georgia, serif;
          font-size: clamp(29px, 4vw, 42px);
          font-weight: 400;
        }

        .daily-tarot-subtitle {
          color: #9a8354;
          font-size: 12px;
          letter-spacing: 1px;
          line-height: 1.7;
        }

        .daily-tarot-date {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 17px;
          color: #858b7d;
          font-size: 11px;
        }

        .daily-tarot-divider {
          width: 55px;
          height: 1px;
          background: #b6a77d;
          margin: 25px 0;
        }

        .daily-tarot-text {
          margin-bottom: 23px;
        }

        .daily-tarot-text h4 {
          margin-bottom: 10px;
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          color: #354a39;
        }

        .daily-tarot-text p {
          color: #687164;
          font-size: 14px;
          line-height: 1.9;
        }

        .daily-tarot-guidance {
          margin-top: auto;
          padding: 20px 22px;
          background: #eff0e7;
          border-left: 2px solid #a28b59;
        }

        .daily-tarot-guidance span {
          color: #8c7547;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .daily-tarot-guidance p {
          margin-top: 10px;
          color: #52634e;
          font-family: Georgia, serif;
          font-size: 15px;
          line-height: 1.8;
        }

        .daily-tarot-message {
          max-width: 700px;
          min-height: 130px;
          margin: 0 auto;
          padding: 35px;
          background: #fbfaf5;
          border: 1px solid rgba(91, 112, 83, 0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          color: #65745f;
          font-family: Georgia, serif;
          font-size: 16px;
          line-height: 1.8;
        }

        .daily-tarot-error {
          color: #a34d43;
        }

        @media (max-width: 750px) {
          .daily-tarot-section {
            padding: 70px 6%;
          }

          .daily-tarot-list {
            grid-template-columns: 1fr;
          }

          .daily-tarot-featured {
            grid-column: auto;
            grid-template-columns: 1fr;
            padding: 25px;
            gap: 28px;
          }

          .daily-tarot-art {
            min-height: 280px;
          }

          .daily-tarot-image {
            min-height: 280px;
          }
        }

        @media (max-width: 480px) {
          .daily-tarot-card {
            padding: 24px 20px;
          }

          .daily-tarot-featured {
            padding: 20px;
          }

          .daily-tarot-content h3 {
            font-size: 31px;
          }

          .daily-tarot-text p {
            font-size: 13px;
          }

          .daily-tarot-art {
            min-height: 250px;
          }

          .daily-tarot-image {
            min-height: 250px;
          }
        }

        /* FINAL MOBILE RESPONSIVE FIX */
@media (max-width: 750px) {
  .daily-tarot-list {
    grid-template-columns: 1fr;
  }

  .daily-tarot-featured {
    grid-template-columns: 1fr !important;
    gap: 24px;
    padding: 24px 20px;
  }

  .daily-tarot-art {
    width: 100%;
    min-height: 280px;
  }

  .daily-tarot-image {
    width: 100%;
    height: 280px;
    min-height: 280px;
    object-fit: contain;
  }

  .daily-tarot-content {
    width: 100%;
    min-width: 0;
  }

  .daily-tarot-content h3 {
    font-size: 30px;
  }

  .daily-tarot-text p,
  .daily-tarot-guidance p {
    overflow-wrap: anywhere;
  }
}
      `}</style>
    </main>
  );
}
