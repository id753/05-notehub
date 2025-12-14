import { createPortal } from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import css from "./Modal.module.css";
import { useEffect } from "react";

interface NoteModalProps {
  onClose: () => void;
  onPageChange: (page: number) => void;
}
const Modal = ({ onClose, onPageChange }: NoteModalProps) => {
  console.log("k");
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    document.body.style.overflow = "hidden"; //Заборона прокрутки фону
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = ""; //Заборона прокрутки фону -
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return createPortal(
    <div
      onClick={handleBackDropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} onPageChange={onPageChange} />
      </div>
    </div>,
    document.body
  );
};

export default Modal;
