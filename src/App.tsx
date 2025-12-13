import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import "./App.css";
import NoteList from "./components/NoteList/NoteList";
import css from "./styles/App.module.css";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
// import ReactPaginate from "react-paginate";
import Pagination from "./components/Pagination/Pagination";
import NoteForm from "./components/NoteForm/NoteForm";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tag: string;
}

export interface NoteHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface NoteData {
  notes: Note[];
  totalPages: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Функция запроса данных
  const fetchNotes = async (page: number): Promise<NoteData> => {
    const response = await axios.get<NoteHttpResponse>(
      "https://notehub-public.goit.study/api/notes",
      {
        params: {
          page: page,
          perPage: 10,
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_NOTE_TOKEN}`,
        },
      }
    );
    // console.log("Notes from API:", response.data.notes.length);
    // console.log("Total pages:", response.data.totalPages);

    return {
      notes: response.data.notes,
      totalPages: response.data.totalPages,
    };
  };

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
    queryKey: ["notes", currentPage],
    queryFn: () => fetchNotes(currentPage),
    placeholderData: keepPreviousData,
  });

  const notes: Note[] = noteData.notes;
  const totalPages: number = noteData.totalPages;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>Заметки не найдены.</p>
      )}
      <NoteForm />
    </div>
  );
}

export default App;
