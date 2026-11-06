
import PageIntro from "../components/PageIntro";
import Heading from "../components/Heading";
import {
  BookOpen,
  Compass,
  Flower2,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";

export default function Learn() {
  const topics = [
    {
      icon: <BookOpen />,
      number: "01",
      title: "Major Arcana",
      desc: "Discover the 22 cards and the larger themes they represent throughout life's journey.",
      className: "learn-topic-rose",
    },
    {
      icon: <Compass />,
      number: "02",
      title: "Minor Arcana",
      desc: "Understand the four suits and how their symbolism connects with everyday experiences.",
      className: "learn-topic-lavender",
    },
    {
      icon: <Flower2 />,
      number: "03",
      title: "Reading with Intuition",
      desc: "Learn to observe images, symbols and your own personal reflections.",
      className: "learn-topic-peach",
    },
  ];

  return (
    <main className="inner-page learn-page">
      <PageIntro
        eyebrow="THE ART OF TAROT"
        title={<>Discover the stories <em>within the cards.</em></>}
        desc="A gentle introduction to tarot, its symbols and the meanings behind every card."
      />

      {/* INTRODUCTION SECTION */}
      <section className="learn-intro section organic-brush">
        <div className="learn-photo">
          <img
            src="/images/vintage-tarot.jpg"
            alt="Vintage tarot cards with botanical details"
          />
          <span className="learn-photo-decoration">✧</span>
        </div>

        <div className="learn-content">
          <label>BEGIN YOUR JOURNEY</label>

          <h2>
            Understand the language of <em>tarot.</em>
          </h2>

          <p>
            Tarot is a collection of symbolic cards that can offer
            prompts for reflection, self-discovery and exploring
            different points of view.
          </p>

          <div className="learn-points">
            <div>
              <BookOpen />
              <span>Tarot card meanings</span>
            </div>

            <div>
              <Compass />
              <span>Understanding the four suits</span>
            </div>

            <div>
              <Flower2 />
              <span>Symbols and intuition</span>
            </div>
          </div>

          <div className="learn-note">
            <Sparkles size={17} />
            <span>Explore, reflect and learn at your own pace.</span>
          </div>
        </div>
      </section>

      {/* FOUNDATIONS SECTION */}
      <section className="learn-foundations section organic-brush">
        <div className="learn-foundation-decoration">
          <Moon />
          <Sparkles />
          <Sun />
        </div>

        <Heading
          eyebrow="LEARN AT YOUR OWN PACE"
          title={<>Start with the <em>foundations.</em></>}
          desc="Explore the basics and build your understanding one step at a time."
        />

        <div className="learn-topic-grid">
          {topics.map((topic) => (
            <article
              className={`learn-topic ${topic.className}`}
              key={topic.number}
            >
              <span className="learn-topic-number">
                {topic.number}
              </span>

              <div className="learn-topic-icon">
                {topic.icon}
              </div>

              <h3>{topic.title}</h3>

              <p>{topic.desc}</p>

              <span className="learn-topic-star">✧</span>
            </article>
          ))}
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="learn-quote organic-wave">
        <span>✧</span>
        <p>
          Every card holds a story.
          <br />
          Every story invites <em>discovery.</em>
        </p>
        <small>THE ART OF UNDERSTANDING YOURSELF</small>
      </section>
    </main>
  );
}
