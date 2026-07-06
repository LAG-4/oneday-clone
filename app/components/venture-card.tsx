import type { Venture } from "../lib/content-types";

export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <article className="venture-card">
      <span className="mono">{venture.category}</span>
      <h4>{venture.name}</h4>
      <p>{venture.description}</p>
      {venture.website ? (
        <a href={venture.website} target="_blank" rel="noreferrer">
          {venture.cta ?? "Visit site"}
        </a>
      ) : null}
    </article>
  );
}
