import { permanentRedirect } from "next/navigation";
import { INTEGRATIONS_ANCHOR } from "@/features/landing/home/links";

export default async function IntegrationsRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  permanentRedirect(`/${params.size ? `?${params}` : ""}#${INTEGRATIONS_ANCHOR}`);
}
