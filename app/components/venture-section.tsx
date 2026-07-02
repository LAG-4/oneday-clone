import type { ReactNode } from "react";
import type { VentureGroup } from "../data/ventures";
import { VentureCard } from "./venture-card";

type VentureSectionProps = {
  groups: VentureGroup[];
  activeGroup: number;
  action: ReactNode;
  onSelectGroup: (index: number) => void;
};

export function VentureSection({
  groups,
  activeGroup,
  action,
  onSelectGroup,
}: VentureSectionProps) {
  const currentGroup = groups[activeGroup] ?? groups[0];

  if (!currentGroup) {
    return null;
  }

  return (
    <div className="portfolio__featured">
      <div className="portfolio-panel" data-reveal>
        <p className="mono">Explore</p>
        <div className="portfolio-panel__headings">
          {groups.map((group, index) => (
            <button
              className={index === activeGroup ? "is-active" : ""}
              key={group.id}
              type="button"
              onClick={() => onSelectGroup(index)}
              onFocus={() => onSelectGroup(index)}
              onPointerEnter={() => onSelectGroup(index)}
            >
              {group.label}
            </button>
          ))}
        </div>
        {action}
      </div>

      <div className="venture-list" data-reveal>
        <div className="venture-list__header">
          <span className="mono">{currentGroup.kicker}</span>
          <h3>{currentGroup.label}</h3>
        </div>
        <div className="venture-list__items">
          {currentGroup.items.map((venture) => (
            <VentureCard key={venture.id} venture={venture} />
          ))}
        </div>
      </div>
    </div>
  );
}
