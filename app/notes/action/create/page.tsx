import NoteForm from "@/components/NoteForm/NoteForm";
import css from "@/app/Home.module.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Create Note | NoteHub",
    description: "Create a new note in NoteHub.",
    openGraph: {
      title: "Create Note | NoteHub",
      description: "Create a new note in NoteHub.",
      url: `${SITE_URL}/notes/action/create`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
      type: "article",
    },
  };
}

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create Note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
