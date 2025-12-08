"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const deleteMutation = useMutation<Note, Error, string>({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id: string) => {
      setDeletingIds((prev) => [...prev, id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSettled: (_data, _error, id) => {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    },
  });

  if (!notes.length) return <p className={css.empty}>No notes found.</p>;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <Link href={`/notes/${id}`} className={css.link}>
              View details
            </Link>

            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(id)}
              disabled={deletingIds.includes(id)}
            >
              {deletingIds.includes(id) ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
