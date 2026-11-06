
export default function Heading({ eyebrow, title, desc }) {
  return (
    <div className="heading">
      <label>{eyebrow}</label>
      <h2>{title}</h2>
      {desc && <p>{desc}</p>}
    </div>
  );
}
