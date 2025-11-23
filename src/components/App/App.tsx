// src/components/App/App.tsx
import { useState } from "react";
import {
  useQuery,
  useMutation,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import { useDebounce } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

export default function App() {
  // 🔹 Получаем клиент кэша
    const queryClient = useQueryClient();
    // 🔹 состояния для пагинации и поиска
  const [page, setPage] = useState(1);
  // 🔹 состояние для поиска
  const [search, setSearch] = useState("");
  
  // 🔹 состояние модалки 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const PER_PAGE = 12;
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", { page, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({
        search: debouncedSearch || undefined, // если пустая строка — не отправляем параметр
        page,
        perPage: PER_PAGE,
        sortBy: "created",
      }),
    placeholderData: keepPreviousData,
  });

  //const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  // 🔹 мутация удаления
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Поиск */}
        <SearchBox value={search} onChange={setSearch} />

        {/* Пагинация в хедере */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>Create note +</button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}

      {!isLoading && !isError && (
        <NoteList notes={data?.notes ?? []} onDelete={handleDelete} />
      )}
      {isModalOpen && (
        <Modal>
  <NoteForm onSuccess={closeModal} onCancel={closeModal} />
</Modal>
      )}
    </div>
  );
}