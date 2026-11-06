
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Button from "../components/Button";
import Heading from "../components/Heading";
import BookingSection from "../components/BookingSection";

export default function Home() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>

        <div className="hero-copy">
          <label>A LITTLE GUIDANCE FROM THE UNIVERSE</label>

          <h1>
            Find the magic in <em>your becoming.</em>
          </h1>

          <p>
            Tarot, astrology and soulful reflections to help you reconnect
            with the wisdom already within you.
          </p>

          <div className="actions">
            <Button light>Explore your reading</Button>

            <Link to="/about">
              Discover Divine Carat <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="intro section organic-divider">
        <div className="about-image">
          <img
            src="https://images.openai.com/static-rsc-4/CG1uuy0RTBtifsy1a0lYkQAAykLW_GfXesi2TSJfcqhw96M5pe1KjxSGPMJi8BcWb5l-6nolht8f_GOMe2ThGTskBSjV8bXrIrpbxS9H-XcJlWpvAZcDocuihzNOmhsOvsd5p4GFNkv2SjeWfHrjp58yY0lix6y1rGgz2elEF5AQ8rFiYieyJbkXb11zgoyb?purpose=fullsize"
            alt="Sage green and gold tarot altar"
          />
        </div>

        <div className="about-content">
          <label>WELCOME TO DIVINE CARAT</label>

          <h2>
            A quiet place to
            <br />
            <em>hear yourself</em> again.
          </h2>

          <p>
            Sometimes, all we need is a moment to pause, a new perspective,
            or a gentle reminder that our story is still unfolding.
            Divine Carat brings together the symbolism of tarot and
            the wonder of the cosmos to create space for just that.
          </p>

          <Link className="under" to="/about">
            Discover our universe <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* TAROT READINGS SECTION */}
      <section className="services section organic-brush">
        <div className="services-heading">
          <label>TAROT READINGS</label>

          <h2>
            A reading for every
            <br />
            <em>chapter of you.</em>
          </h2>

          <p>
            Choose the space that feels closest to what your heart is asking.
          </p>
        </div>

        <div className="reading-grid">
          <article className="reading-item">
            <div className="reading-image">
              <img
                src="/images/love-reading.jpg"
                alt="Romantic tarot reading"
              />
            </div>

            <h3>The Love Reading</h3>

            <p>
              Explore matters of the heart, emotional connections and the
              energy surrounding your relationships.
            </p>

            <Link to="/tarot" className="reading-link">
              Explore reading <ArrowUpRight size={16} />
            </Link>
          </article>

          <article className="reading-item">
            <div className="reading-image">
              <img
                src="/images/life-path.jpg"
                alt="Celestial tarot reading"
              />
            </div>

            <h3>The Life Path</h3>

            <p>
              Find clarity around your direction, purpose and the choices
              waiting ahead of you.
            </p>

            <Link to="/tarot" className="reading-link">
              Explore reading <ArrowUpRight size={16} />
            </Link>
          </article>

          <article className="reading-item">
            <div className="reading-image">
              <img
                src="/images/soul-session.jpg"
                alt="Peaceful spiritual tarot altar"
              />
            </div>

            <h3>The Soul Session</h3>

            <p>
              A thoughtful reading for inner reflection, personal growth
              and new beginnings.
            </p>

            <Link to="/tarot" className="reading-link">
              Explore reading <ArrowUpRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      {/* QUOTE SECTION */}
      <section className="quote organic-wave">
        <p>
          <span style={{ color: "#ffffff" }}>
            The answers you seek are often
          </span>{" "}
          <em>whispering within you.</em>
        </p>
      </section>

      {/* LEARN SECTION */}
      <section className="learn section organic-divider">
        <div className="learn-photo">
          <img
            src="/images/tarot-learning.jpg"
            alt="Beautiful tarot cards with celestial details"
          />
        </div>

        <div className="learn-content">
          <label>EXPLORE THE WORLD OF TAROT</label>

          <h2>
            Every card holds
            <br />
            a <em>little story.</em>
          </h2>

          <p>
            Discover the symbols, archetypes and gentle lessons behind
            the tarot. Begin with curiosity and let your intuition lead.
          </p>

          <Button to="/learn">Explore tarot</Button>
        </div>
      </section>

      {/* ZODIAC SECTION */}
      <section className="zodiac section organic-brush">
        <div className="zodiac-heading">
          <label>THE TWELVE SIGNS</label>

          <h2>
            Written in the <em>stars.</em>
          </h2>

          <p>
            Discover the energy, personality and symbolism of your zodiac sign.
          </p>
        </div>

        <div className="signs">
          {[
            ["♈", "Aries", "MAR 21 – APR 19"],
            ["♉", "Taurus", "APR 20 – MAY 20"],
            ["♊", "Gemini", "MAY 21 – JUN 20"],
            ["♋", "Cancer", "JUN 21 – JUL 22"],
            ["♌", "Leo", "JUL 23 – AUG 22"],
            ["♍", "Virgo", "AUG 23 – SEP 22"],
            ["♎", "Libra", "SEP 23 – OCT 22"],
            ["♏", "Scorpio", "OCT 23 – NOV 21"],
            ["♐", "Sagittarius", "NOV 22 – DEC 21"],
            ["♑", "Capricorn", "DEC 22 – JAN 19"],
            ["♒", "Aquarius", "JAN 20 – FEB 18"],
            ["♓", "Pisces", "FEB 19 – MAR 20"],
          ].map(([symbol, name, dates]) => (
            <Link
              to="/zodiac"
              className="zodiac-sign"
              key={name}
            >
              <span className="zodiac-symbol">{symbol}</span>
              <span className="zodiac-name">{name}</span>
              <span className="zodiac-date">{dates}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* JOURNAL SECTION */}
      <section className="journal section organic-wave">
        <Heading
          eyebrow="THE JOURNAL"
          title={
            <>
              Words to keep <em>close to heart.</em>
            </>
          }
          desc="Thoughts, reflections and little reminders for your journey."
        />

        <div className="journal-grid">
          <article className="journal-item journal-one">
            <div className="journal-icon">
              <img
                src="/images/journal-moon.jpg"
                alt="Crescent moon illustration"
              />
            </div>

            <span className="journal-category">SELF REFLECTION</span>

            <h3>Learning to trust the quiet voice within</h3>

            <Link to="/journal">
              Read more <ArrowUpRight size={15} />
            </Link>
          </article>

          <article className="journal-item journal-two">
            <div className="journal-icon">
              <img
                src="/images/journal-sun.jpg"
                alt="Sun illustration"
              />
            </div>

            <span className="journal-category">NEW BEGINNINGS</span>

            <h3>Making room for a beautiful new beginning</h3>

            <Link to="/journal">
              Read more <ArrowUpRight size={15} />
            </Link>
          </article>

          <article className="journal-item journal-three">
            <div className="journal-icon">
              <img
                src="/images/journal-star.jpg"
                alt="Star illustration"
              />
            </div>

            <span className="journal-category">INSPIRATION</span>

            <h3>Finding hope in the journey of life</h3>

            <Link to="/journal">
              Read more <ArrowUpRight size={15} />
            </Link>
          </article>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <BookingSection />
    </main>
  );
}
