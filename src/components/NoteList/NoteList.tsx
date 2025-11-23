// src/components/NoteList/NoteList.tsx
import NoteCard from "../NoteCard/NoteCard";
import css from "./NoteList.module.css";
import type { Note } from "../../types/note1";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (!notes.length) return <p>No notes yet</p>;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </ul>
  );
}
