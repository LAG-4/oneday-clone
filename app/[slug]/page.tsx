import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteExperience } from "../components/site-experience";
import { applyProfile, getProfile, getProfiles, getSiteContent } from "../lib/content";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const profiles = await getProfiles();
  return profiles.map((profile) => ({ slug: profile.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) return {};
  return {
    title: `${profile.name} | Brody Billings`,
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({ params }: Params) {
  const { slug } = await params;
  const profile = await getProfile(slug);
  if (!profile) notFound();

  const content = await getSiteContent();
  return <SiteExperience content={applyProfile(content, profile)} profile={profile} />;
}
