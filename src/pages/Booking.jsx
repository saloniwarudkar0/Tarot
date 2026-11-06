import { useState } from "react";
import { Mail, Send } from "lucide-react";
import PageIntro from "../components/PageIntro";

export default function Booking() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "Book a tarot reading",
    reading: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const data = {
      access_key: "8a133e6a-fb05-462d-b510-2d0b8109c023",
      subject: "New enquiry - DIVINE CARAT",
      from_name: "DIVINE CARAT Website",
      name: form.name,
      email: form.email,
      phone: form.phone,
      enquiry_type: form.enquiryType,
      reading: form.reading,
      message: form.message,
      botcheck: "",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("Thank you! Your enquiry has been submitted successfully.");
        setForm({
          name: "",
          email: "",
          phone: "",
          enquiryType: "Book a tarot reading",
          reading: "",
          message: "",
        });
      } else {
        setStatus(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Unable to submit your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="inner-page booking-page">
      <PageIntro
        eyebrow="BOOK A READING"
        title={<>Your next chapter <em>starts here.</em></>}
        desc="Take a breath, set an intention and tell us what kind of reading you are looking for."
      />

      <section className="booking section">
        <div className="booking-content">
          <label>YOUR NEXT CHAPTER</label>

          <h2>
            Ready to meet yourself
            <br />
            <em>where you are?</em>
          </h2>

          <p>
            Whether you are looking for a personal reading or simply
            have a question, we would love to hear from you.
          </p>

          <a href="mailto:hello@divinecarat.com">
            <Mail size={17} /> hello@divinecarat.com
          </a>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <h3>Send us a message</h3>

          <label htmlFor="name">Your name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Mobile number</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter your 10-digit mobile number"
            value={form.phone}
            onChange={handleChange}
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            title="Enter a valid 10-digit Indian mobile number"
            required
          />

          <label htmlFor="enquiryType">What brings you here?</label>
          <select
            id="enquiryType"
            name="enquiryType"
            value={form.enquiryType}
            onChange={handleChange}
          >
            <option>Book a tarot reading</option>
            <option>General enquiry</option>
            <option>Question about tarot</option>
            <option>Other</option>
          </select>

          <label htmlFor="reading">Preferred reading</label>
          <select
            id="reading"
            name="reading"
            value={form.reading}
            onChange={handleChange}
          >
            <option value="">Select a reading (optional)</option>
            <option>The Love Reading</option>
            <option>The Life Path</option>
            <option>The Soul Session</option>
            <option>Not sure yet</option>
          </select>

          <label htmlFor="message">Your message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Tell us a little about what you are looking for..."
            value={form.message}
            onChange={handleChange}
            required
          />

          <button className="button light" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send enquiry"}
            <Send size={16} />
          </button>

          {status && <p role="status">{status}</p>}
        </form>
      </section>
    </main>
  );
}