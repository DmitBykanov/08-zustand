import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { HydrationBoundary } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  return {
    title: `Notes - ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
    description: `A collection of notes tagged with "${tag}".`,
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const tag = slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
