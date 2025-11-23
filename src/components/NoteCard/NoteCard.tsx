import type { Note } from "../../types/Note";
import css from "./NoteCard.module.css";

interface Props {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: Props) {
    console.log(note);
  return (
    <li className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>

      {/* ВАЖНО: контент хранится в note.text */}
      <p className={css.content}>{note.content}</p>

      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <button className={css.button} onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </li>
  );
}
