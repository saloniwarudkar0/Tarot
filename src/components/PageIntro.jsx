
export default function PageIntro({ eyebrow, title, desc }) {
  return (
    <section className="page-hero">
      <div className="page-hero-content">
        <label>{eyebrow}</label>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
    </section>
  );
}
