import venturesData from "./ventures.json";

export type VentureStatus = "active" | "past" | "planned";

export type Venture = {
  id: string;
  name: string;
  category: string;
  status: VentureStatus;
  logo: string | null;
  description: string;
  website: string | null;
  images: string[];
  cta: string | null;
  tags: string[];
  featured: boolean;
  hidden: boolean;
  order: number;
};

export type VentureGroup = {
  id: string;
  label: string;
  kicker: string;
  status: VentureStatus;
  order: number;
  hidden: boolean;
  items: Venture[];
};

type VentureDataFile = {
  groups: VentureGroup[];
};

const sortByOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

const data = venturesData as VentureDataFile;

export const ventureGroups: VentureGroup[] = sortByOrder(data.groups)
  .filter((group) => !group.hidden)
  .map((group) => ({
    ...group,
    items: sortByOrder(group.items).filter((venture) => !venture.hidden),
  }))
  .filter((group) => group.items.length > 0);
