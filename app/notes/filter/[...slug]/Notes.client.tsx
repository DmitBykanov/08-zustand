"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import css from "./NotesPage.module.css";

const NOTES_PER_PAGE = 12;

interface NotesClientProps {
  tag: string | null;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const perPage = NOTES_PER_PAGE;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", currentPage, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (isError) {
    return <p>Could not fetch the list of notes. Something went wrong!</p>;
  }

  if (isLoading && !data) {
    return <p>Loading, please wait...</p>;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note
        </Link>
      </header>

      <NoteList notes={notes} />
    </div>
  );
}
