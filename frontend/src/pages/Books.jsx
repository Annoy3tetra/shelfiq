import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Filter,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { cn } from "../utils/cn";

import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import Modal from "../components/ui/Modal";
import SearchBar from "../components/ui/SearchBar";
import { TableSkeleton } from "../components/ui/Skeleton";

import {
  createBook,
  deleteBook,
  getBooks,
  updateBook,
} from "../services/bookService";

const GENRES = [
  "Fiction",
  "Non Fiction",
  "Business",
  "Technology",
  "Science",
  "Education",
  "Children",
  "Biography",
  "History",
  "Comics",
  "Other",
];

const SORT_OPTIONS = [
  { label: "Title A-Z", value: "title-asc" },
  { label: "Title Z-A", value: "title-desc" },
  { label: "Price Low-High", value: "price-asc" },
  { label: "Price High-Low", value: "price-desc" },
  { label: "Stock Low-High", value: "stock-asc" },
  { label: "Stock High-Low", value: "stock-desc" },
];

const LIMIT = 10;

const defaultValues = {
  title: "",
  author: "",
  isbn: "",
  genre: "Fiction",
  publisher: "",
  price: "",
  stock_quantity: "",
  reorder_level: "",
  shelf_location: "",
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("title-asc");
  const [loading, setLoading] = useState(true);
  
  const [genreOpen, setGenreOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const genreRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreRef.current && !genreRef.current.contains(event.target)) {
        setGenreOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await getBooks(page, LIMIT);
      const normalized = normalizeBookPayload(payload);

      setBooks(normalized.books);
      setTotal(normalized.total);
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load books. Please refresh and try again.");
      toast.error("Could not load books");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books
      .filter((book) => {
        const matchesSearch = [book.title, book.author, book.isbn, book.publisher, book.shelf_location]
          .some((value) => String(value ?? "").toLowerCase().includes(query));
        const matchesGenre = genre === "all" || book.genre === genre;

        return matchesSearch && matchesGenre;
      })
      .sort((first, second) => sortBooks(first, second, sort));
  }, [books, genre, search, sort]);

  const totalPages = total ? Math.max(1, Math.ceil(total / LIMIT)) : null;
  const canGoNext = totalPages ? page < totalPages : books.length >= LIMIT;

  const openCreateModal = () => {
    setSelectedBook(null);
    setModalMode("create");
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setModalMode("edit");
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setModalMode("delete");
  };

  const closeModal = () => {
    if (saving || deleting) {
      return;
    }

    setModalMode(null);
    setSelectedBook(null);
  };

  const handleSaveBook = async (values) => {
    const payload = toBookPayload(values);

    try {
      setSaving(true);

      if (modalMode === "edit" && selectedBook) {
        await updateBook(selectedBook.id, payload);
        toast.success("Book updated");
      } else {
        await createBook(payload);
        toast.success("Book added");
      }

      closeModal();
      fetchBooks();
    } catch (requestError) {
      console.log(requestError);
      toast.error(modalMode === "edit" ? "Could not update book" : "Could not add book");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) {
      return;
    }

    try {
      setDeleting(true);
      await deleteBook(selectedBook.id);
      toast.success("Book deleted");
      closeModal();
      fetchBooks();
    } catch (requestError) {
      console.log(requestError);
      toast.error("Could not delete book");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Book",
      render: (book) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-950">{book.title}</p>
          <p className="mt-1 text-xs text-slate-500">ISBN {book.isbn || "Not set"}</p>
        </div>
      ),
    },
    { key: "author", header: "Author" },
    {
      key: "genre",
      header: "Genre",
      render: (book) => (
        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {book.genre}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (book) => <span className="font-medium">{formatCurrency(book.price)}</span>,
    },
    {
      key: "stock_quantity",
      header: "Stock",
      render: (book) => (
        <span className={book.stock_quantity <= book.reorder_level ? "font-semibold text-amber-600" : "text-slate-700"}>
          {book.stock_quantity}
        </span>
      ),
    },
    { key: "shelf_location", header: "Shelf" },
    {
      key: "actions",
      header: "",
      cellClassName: "text-right",
      render: (book) => (
        <div className="flex justify-end gap-2">
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            onClick={() => openEditModal(book)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-blue-600"
            aria-label={`Edit ${book.title}`}
            title="Edit"
          >
            <Edit3 size={16} />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            onClick={() => openDeleteModal(book)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/60"
            aria-label={`Delete ${book.title}`}
            title="Delete"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Inventory management</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">Books</h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={fetchBooks}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            <Plus size={18} />
            Add Book
          </button>
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="mb-5 grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_220px]">
          <SearchBar
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, ISBN, publisher, shelf"
          />

          {/* Genre Dropdown Select */}
          <div ref={genreRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setGenreOpen(!genreOpen)}
              className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-705 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Filter size={16} className="text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {genre === "all" ? "All genres" : genre}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            </button>
            
            <AnimatePresence>
              {genreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => { setGenre("all"); setGenreOpen(false); }}
                    className={cn(
                      "flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors text-left",
                      genre === "all"
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                        : "text-slate-755 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40"
                    )}
                  >
                    All genres
                  </button>
                  {GENRES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { setGenre(item); setGenreOpen(false); }}
                      className={cn(
                        "flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors text-left",
                        genre === item
                          ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                          : "text-slate-755 hover:bg-slate-55 dark:text-slate-300 dark:hover:bg-slate-800/40"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown Select */}
          <div ref={sortRef} className="relative w-full">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-705 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <SlidersHorizontal size={16} className="text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {SORT_OPTIONS.find(o => o.value === sort)?.label || "Sort options"}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-0 right-0 z-20 mt-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { setSort(option.value); setSortOpen(false); }}
                      className={cn(
                        "flex w-full items-center rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors text-left",
                        sort === option.value
                          ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                          : "text-slate-755 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/40"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mb-4 flex flex-col justify-between gap-2 text-sm text-slate-500 sm:flex-row">
          <span>
            Page {page}{totalPages ? ` of ${totalPages}` : ""} · {visibleBooks.length} visible
          </span>
          {error ? <span className="font-medium text-red-600">{error}</span> : null}
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <DataTable
            columns={columns}
            data={visibleBooks}
            emptyTitle="No books found"
            emptyDescription="Add inventory or refine your search and filters to see matching books."
          />
        )}
      </Card>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-slate-500">
          Showing up to {LIMIT} records per page
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-slate-600">
            Page {page}
          </span>

          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={!canGoNext || loading}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <BookFormModal
        open={modalMode === "create" || modalMode === "edit"}
        mode={modalMode}
        book={selectedBook}
        saving={saving}
        onClose={closeModal}
        onSubmit={handleSaveBook}
      />

      <DeleteBookModal
        open={modalMode === "delete"}
        book={selectedBook}
        deleting={deleting}
        onClose={closeModal}
        onConfirm={handleDeleteBook}
      />
    </Layout>
  );
};

const BookFormModal = ({ open, mode, book, saving, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(book ? toFormValues(book) : defaultValues);
    }
  }, [book, open, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit book" : "Add book"}
      description="Maintain catalog details, pricing, stock thresholds, and shelf placement."
      width="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" error={errors.title?.message}>
            <input
              {...register("title", { required: "Title is required" })}
              className={inputClass}
              placeholder="Atomic Habits"
            />
          </Field>

          <Field label="Author" error={errors.author?.message}>
            <input
              {...register("author", { required: "Author is required" })}
              className={inputClass}
              placeholder="James Clear"
            />
          </Field>

          <Field label="ISBN" error={errors.isbn?.message}>
            <input
              {...register("isbn", {
                required: "ISBN is required",
                minLength: { value: 10, message: "ISBN must be at least 10 characters" },
              })}
              className={inputClass}
              placeholder="9780735211292"
            />
          </Field>

          <Field label="Genre" error={errors.genre?.message}>
            <select
              {...register("genre", { required: "Genre is required" })}
              className={inputClass}
            >
              {GENRES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Publisher" error={errors.publisher?.message}>
            <input
              {...register("publisher", { required: "Publisher is required" })}
              className={inputClass}
              placeholder="Penguin"
            />
          </Field>

          <Field label="Shelf Location" error={errors.shelf_location?.message}>
            <input
              {...register("shelf_location", { required: "Shelf location is required" })}
              className={inputClass}
              placeholder="A3-12"
            />
          </Field>

          <Field label="Price" error={errors.price?.message}>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className={inputClass}
              placeholder="499"
            />
          </Field>

          <Field label="Stock Quantity" error={errors.stock_quantity?.message}>
            <input
              type="number"
              {...register("stock_quantity", {
                required: "Stock quantity is required",
                min: { value: 0, message: "Stock cannot be negative" },
                valueAsNumber: true,
              })}
              className={inputClass}
              placeholder="25"
            />
          </Field>

          <Field label="Reorder Level" error={errors.reorder_level?.message}>
            <input
              type="number"
              {...register("reorder_level", {
                required: "Reorder level is required",
                min: { value: 0, message: "Reorder level cannot be negative" },
                valueAsNumber: true,
              })}
              className={inputClass}
              placeholder="5"
            />
          </Field>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-10 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteBookModal = ({ open, book, deleting, onClose, onConfirm }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Delete book"
    description="This action permanently removes the book from inventory."
    width="max-w-md"
  >
    <div className="rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/70 dark:bg-red-950/30">
      <p className="text-sm text-red-800 dark:text-red-100">
        Delete <span className="font-semibold">{book?.title}</span>? This cannot be undone.
      </p>
    </div>

    <div className="mt-5 flex flex-col-reverse justify-end gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onClose}
        disabled={deleting}
        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={deleting}
        className="h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete Book"}
      </button>
    </div>
  </Modal>
);

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="text-sm font-semibold text-slate-700">{label}</span>
    <div className="mt-2">{children}</div>
    {error ? <span className="mt-1 block text-xs font-medium text-red-600">{error}</span> : null}
  </label>
);

const inputClass = "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100";

const normalizeBookPayload = (payload) => {
  if (Array.isArray(payload)) {
    return { books: payload, total: null };
  }

  const books = payload?.items ?? payload?.data ?? payload?.books ?? payload?.results ?? [];
  const total = payload?.total ?? payload?.count ?? payload?.total_count ?? null;

  return { books, total };
};

const sortBooks = (first, second, sort) => {
  const [field, direction] = sort.split("-");
  const multiplier = direction === "asc" ? 1 : -1;

  if (field === "price") {
    return (Number(first.price) - Number(second.price)) * multiplier;
  }

  if (field === "stock") {
    return (Number(first.stock_quantity) - Number(second.stock_quantity)) * multiplier;
  }

  return String(first.title ?? "").localeCompare(String(second.title ?? "")) * multiplier;
};

const toFormValues = (book) => ({
  title: book.title ?? "",
  author: book.author ?? "",
  isbn: book.isbn ?? "",
  genre: book.genre ?? "Fiction",
  publisher: book.publisher ?? "",
  price: book.price ?? "",
  stock_quantity: book.stock_quantity ?? "",
  reorder_level: book.reorder_level ?? "",
  shelf_location: book.shelf_location ?? "",
});

const toBookPayload = (values) => ({
  ...values,
  price: Number(values.price),
  stock_quantity: Number(values.stock_quantity),
  reorder_level: Number(values.reorder_level),
});

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
};

export default Books;
