import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import "./App.css";
import NoteList from "./components/NoteList/NoteList";
import css from "./styles/App.module.css";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
// import ReactPaginate from "react-paginate";
import Pagination from "./components/Pagination/Pagination";
// import NoteForm from "./components/NoteForm/NoteForm";
import Modal from "./components/Modal/Modal";
import { fetchNotes, type NoteData } from "./services/noteService";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "./components/SearchBox/SearchBox";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tag: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const initialNoteData: NoteData = {
    notes: [],
    totalPages: 0,
  };

  // Использование useQuery
  const {
    data: noteData = initialNoteData,
    isLoading,
    isError,
  } = useQuery<NoteData>({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = noteData.notes;
  const totalPages: number = noteData.totalPages;

  const debounceSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value.toLowerCase());
      setCurrentPage(1);
    },
    300
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox search={search} onChange={debounceSearch} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>Заметки не найдены.</p>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

export default App;
