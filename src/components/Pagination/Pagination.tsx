import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      pageCount={totalPages}
      onPageChange={(e) => onPageChange(e.selected + 1)}
      forcePage={page - 1}

      // 🟦 КЛАССЫ ПОД СТИЛИ
      containerClassName={css.pagination}
      pageClassName=""              // используется .pagination li
      previousClassName=""          // тоже ли
      nextClassName=""
      breakClassName=""
      activeClassName={css.active}
    />
  );
}
