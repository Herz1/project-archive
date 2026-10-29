import { sitePath } from "@/lib/site";
export function LandingEntry({ label, className }: { isSignedIn: boolean; label: string; className: string }) {
  return <a href={sitePath("archive/")} className={className}>{label} <span aria-hidden>↗</span></a>;
}
