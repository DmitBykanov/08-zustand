"use client";
import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const NoteDetailsErrorPage: React.FC<ErrorProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
};

export default NoteDetailsErrorPage;
