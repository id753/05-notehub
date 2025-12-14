// Функції для виконання HTTP-запитів
import axios from "axios";
import type { Note } from "../App";

export interface NoteHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface NoteData {
  notes: Note[];
  totalPages: number;
}
export interface CreateNoteData {
  title: string;
  content: string;
  tag: "Shopping" | "Meeting" | "Personal" | "Work" | "Todo";
}

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

// Функция запроса данных
export const fetchNotes = async (
  page: number,
  search: string
): Promise<NoteData> => {
  const response = await axios.get<NoteHttpResponse>("/notes", {
    params: {
      search,
      page: page,
      perPage: 10,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });

  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages,
  };
};

export const createNote = async (newNote: CreateNoteData) => {
  const response = await axios.post<Note>("/notes", newNote, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};

export const deleteNote = async (id: Note["id"]) => {
  const response = await axios.delete(`/notes/${id}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
};
