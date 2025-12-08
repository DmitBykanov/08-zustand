"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  } else if (isError) {
    return <p>Something went wrong.</p>;
  } else if (!note) {
    return <p>Note not found</p>;
  } else {
    return (
      <Modal onClose={handleBack}>
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>

            <p className={css.content}>{note.content}</p>

            <p className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString("uk-UA")}
            </p>

            {note.tag && <p className={css.tag}>{note.tag}</p>}
          </div>
        </div>
        <button className={css.backBtn} onClick={handleBack}>
          ← Back
        </button>
      </Modal>
    );
  }
}
