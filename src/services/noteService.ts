import axios, { type AxiosResponse } from "axios";
import type { Note } from "../types/note_1";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

if (!token) {
  // на випадок, якщо забудеш покласти токен у .env
  console.warn("VITE_NOTEHUB_TOKEN is not set");
}

function getAuthHeaders() {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page?: number;
  perPage?: number;
  total?: number;
}

/** Отримати список нотаток */
export async function fetchNotes(
  params: FetchNotesParams
): Promise<NotesResponse> {
  const res: AxiosResponse<NotesResponse> = await axios.get(
    `${BASE_URL}/notes`,
    {
      headers: getAuthHeaders(),
      params,
    }
  );

  return res.data;
}

/** Пейлоад для створення нотатки */
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

/** Створити нотатку */
export async function createNote(
  
  payload: CreateNotePayload
): Promise<Note> {

   console.log("🔑 Token:", token ? "Present" : "Missing");
  console.log("📦 Payload:", payload);
  const res: AxiosResponse<Note> = await axios.post(
    `${BASE_URL}/notes`,
    payload,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
}

/** Видалити нотатку за id */
export async function deleteNote(id: string): Promise<Note> {
  const res: AxiosResponse<Note> = await axios.delete(
    `${BASE_URL}/notes/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
}
