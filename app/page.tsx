import { SiteExperience } from "./components/site-experience";
import { getSiteContent } from "./lib/content";

export const revalidate = 300;

export default async function Home() {
  const content = await getSiteContent();
  return <SiteExperience content={content} />;
}
