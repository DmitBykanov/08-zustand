"use client";

import { useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

export default function Modal({ children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.body;
    if (!target) return;
    const scrollY = window.scrollY;
    const originalOverflow = target.style.overflow;

    target.style.overflow = "hidden";

    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("scroll-position", String(scrollY));
    }

    return () => {
      target.style.overflow = originalOverflow;

      let savedScrollY = scrollY;
      if (typeof sessionStorage !== "undefined") {
        const storedY = sessionStorage.getItem("scroll-position");
        if (storedY) {
          savedScrollY = parseInt(storedY, 10);
          sessionStorage.removeItem("scroll-position");
        }
      }

      window.scrollTo(0, savedScrollY);
    };
  }, []);

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div ref={backdropRef} className={css.backdrop}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
