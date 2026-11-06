
import { useEffect, useState } from "react";
import PageIntro from "../components/PageIntro";
import {
  Sparkles,
  Moon,
  Heart,
  Compass,
  Flower2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const defaultAbout = {
  story: {
    label: "THE STORY OF DIVINE CARAT",
    heading: "Created for moments of pause and possibility.",
    paragraphOne:
      "Life is full of questions, changes and moments when we need space to listen to ourselves. Divine Carat brings together tarot, astrology and thoughtful reflections to create a welcoming space for that journey.",
    paragraphTwo:
      "Our intention is to encourage self-reflection and help you explore your own thoughts with curiosity.",
  },

  philosophy: {
    label: "WHAT WE BELIEVE",
    heading: "A little wonder. A little wisdom.",
    description:
      "We believe that meaningful journeys begin with curiosity and the willingness to understand ourselves.",
    values: [
      {
        title: "Reflection",
        description:
          "Make room for quiet moments, thoughtful questions and a deeper understanding of yourself.",
      },
      {
        title: "Exploration",
        description:
          "Explore tarot and astrology as symbolic tools for discovering fresh perspectives.",
      },
      {
        title: "Self-connection",
        description:
          "Honour your own experiences, feelings and the choices that shape your journey.",
      },
    ],
  },

  approach: {
    label: "OUR APPROACH",
    heading: "Guidance that leaves room for your own path.",
    description:
      "At Divine Carat, tarot and astrology are approached as invitations to reflect, not as fixed answers about your future. Every experience is an opportunity to pause, explore possibilities and make choices that feel right for you.",
  },

  promise: {
    label: "A NOTE FROM DIVINE CARAT",
    heading:
      "Your story is still unfolding. Let curiosity lead the way.",
    description:
      "Wherever you are in your journey, there is always room for a new perspective.",
  },

  closingQuote: "Your journey is yours to discover.",
};

const valueIcons = [Moon, Compass, Heart];
const valueClasses = [
  "about-value-rose",
  "about-value-lavender",
  "about-value-peach",
];

export default function About() {
  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/about/public`
        );

        if (!response.ok) {
          throw new Error("Unable to load About page content.");
        }

        const result = await response.json();

        if (result.success && result.about) {
          setAbout((previous) => ({
            ...previous,
            ...result.about,

            story: {
              ...previous.story,
              ...(result.about.story || {}),
            },

            philosophy: {
              ...previous.philosophy,
              ...(result.about.philosophy || {}),
              values:
                result.about.philosophy?.values?.length
                  ? result.about.philosophy.values
                  : previous.philosophy.values,
            },

            approach: {
              ...previous.approach,
              ...(result.about.approach || {}),
            },

            promise: {
              ...previous.promise,
              ...(result.about.promise || {}),
            },
          }));
        }
      } catch (error) {
        console.error("About page API error:", error);
      }
    };

    fetchAbout();
  }, []);

  return (
    <main className="inner-page about-page">
      <PageIntro
        eyebrow="OUR UNIVERSE"
        title={
          <>
            A quiet space to <em>find your way.</em>
          </>
        }
        desc="Welcome to Divine Carat — a place for curiosity, reflection and a little more wonder."
      />

      {/* OUR STORY */}
      <section className="about-story section organic-brush">
        <div className="about-image">
          <img
            src="/images/antique-tarot.jpg"
            alt="Antique tarot cards collection with botanical details"
          />
          <span className="about-image-star">✧</span>
        </div>

        <div className="about-content">
          <label>{about.story.label}</label>

          <h2>{about.story.heading}</h2>

          <p>{about.story.paragraphOne}</p>

          <p>{about.story.paragraphTwo}</p>

          <div className="about-signature">
            <Sparkles size={19} />
            <span>THE ART OF THE UNIVERSE</span>
          </div>
        </div>
      </section>

      {/* OUR PHILOSOPHY */}
      <section className="about-philosophy section organic-brush">
        <div className="about-section-heading">
          <label>{about.philosophy.label}</label>

          <h2>{about.philosophy.heading}</h2>

          <p>{about.philosophy.description}</p>
        </div>

        <div className="about-values">
          {about.philosophy.values.map((value, index) => {
            const Icon = valueIcons[index] || Sparkles;
            const valueClass =
              valueClasses[index] || "about-value-rose";

            return (
              <article
                className={`about-value ${valueClass}`}
                key={`${value.title}-${index}`}
              >
                <div>
                  <Icon />
                </div>

                <h3>{value.title}</h3>

                <p>{value.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="about-approach section organic-brush">
        <div className="about-approach-content">
          <label>{about.approach.label}</label>

          <h2>{about.approach.heading}</h2>

          <p>{about.approach.description}</p>
        </div>

        <div className="about-approach-art">
          <Flower2 />
          <span>✧</span>
          <Moon />
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="about-promise section">
        <Sparkles />

        <label>{about.promise.label}</label>

        <h2>{about.promise.heading}</h2>

        <p>{about.promise.description}</p>
      </section>

      {/* CLOSING QUOTE */}
      <section className="quote about-quote organic-wave">
        <p>
          <span className="about-quote-white">
            {about.closingQuote.replace(/discover\.$/, "")}
          </span>
          {about.closingQuote.endsWith("discover.") && (
            <em>discover.</em>
          )}
        </p>
      </section>
    </main>
  );
}
