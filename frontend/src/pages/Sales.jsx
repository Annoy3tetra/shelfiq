import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  CreditCard,
  Minus,
  Plus,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import SearchBar from "../components/ui/SearchBar";
import { Skeleton } from "../components/ui/Skeleton";

import { getBooks } from "../services/bookService";
import { createSale } from "../services/saleService";

const INVENTORY_LIMIT = 50;

const Sales = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await getBooks(1, INVENTORY_LIMIT);

      setBooks(normalizeBookPayload(payload));
    } catch (requestError) {
      console.log(requestError);
      setError("Unable to load inventory. Please refresh and try again.");
      toast.error("Could not load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const visibleBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) =>
      [book.title, book.author, book.isbn, book.genre]
        .some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [books, search]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0);
  }, [cart]);

  const cartQuantity = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = (book) => {
    if (Number(book.stock_quantity) <= 0) {
      toast.error("This book is out of stock");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === book.id);

      if (existing) {
        if (existing.quantity >= Number(book.stock_quantity)) {
          toast.error("No more stock available for this title");
          return current;
        }

        return current.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...current, { ...book, quantity: 1 }];
    });
  };

  const increaseQuantity = (bookId) => {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== bookId) {
          return item;
        }

        if (item.quantity >= Number(item.stock_quantity)) {
          toast.error("No more stock available for this title");
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (bookId) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === bookId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (bookId) => {
    setCart((current) => current.filter((item) => item.id !== bookId));
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      toast.error("Add at least one book to checkout");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        book_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      setCheckingOut(true);
      await createSale(payload);
      toast.success("Sale completed successfully");
      setCart([]);
      fetchInventory();
    } catch (requestError) {
      console.log(requestError);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-slate-500">Point of sale</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Sales counter
          </h2>
        </div>

        <button
          type="button"
          onClick={fetchInventory}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Inventory
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card className="p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Inventory</h3>
              <p className="mt-1 text-sm text-slate-500">
                Search titles and add them to the current sale.
              </p>
            </div>

            <SearchBar
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, author, ISBN, or genre"
              className="lg:max-w-md"
            />
          </div>

          {error ? (
            <div className="mb-4">
              <ErrorState
                title="Inventory unavailable"
                description={error}
                onRetry={fetchInventory}
              />
            </div>
          ) : null}

          {loading ? (
            <InventorySkeleton />
          ) : visibleBooks.length ? (
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {visibleBooks.map((book) => {
                const inCart = cart.find((item) => item.id === book.id);
                const outOfStock = Number(book.stock_quantity) <= 0;

                return (
                  <motion.article
                    key={book.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <BookOpen size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-slate-950">
                          {book.title}
                        </h4>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {book.author || "Unknown author"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-950">
                          {formatCurrency(book.price)}
                        </p>
                        <p className={outOfStock ? "text-xs font-semibold text-red-600" : "text-xs text-slate-500"}>
                          {outOfStock ? "Out of stock" : `${book.stock_quantity} in stock`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => addToCart(book)}
                        disabled={outOfStock}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        <Plus size={16} />
                        {inCart ? inCart.quantity : "Add"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No books found"
              description="Try another search term or refresh inventory."
            />
          )}
        </Card>

        <Card className="h-fit p-4 sm:p-5 xl:sticky xl:top-24">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-950">Shopping cart</h3>
              <p className="mt-1 text-sm text-slate-500">
                {cartQuantity} item{cartQuantity === 1 ? "" : "s"} selected
              </p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
              <ShoppingCart size={20} />
            </span>
          </div>

          <div className="min-h-64 space-y-3">
            <AnimatePresence initial={false}>
              {cart.length ? (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.16 }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-500 transition hover:bg-red-50"
                        aria-label={`Remove ${item.title}`}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:text-slate-950"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="min-w-9 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:text-slate-950"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-slate-950">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="empty-cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState
                    title="Cart is empty"
                    description="Add books from inventory to prepare the checkout."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-700">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-semibold text-slate-950">Total</span>
              <span className="text-2xl font-semibold text-slate-950">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!cart.length || checkingOut}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-500"
            >
              <CreditCard size={18} />
              {checkingOut ? "Processing..." : "Checkout"}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ReceiptText size={14} />
              Sale payload posts to /sales
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

const InventorySkeleton = () => (
  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <Skeleton className="h-11 w-11" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="mt-5 h-9 w-full" />
      </div>
    ))}
  </div>
);

const normalizeBookPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.items ?? payload?.data ?? payload?.books ?? payload?.results ?? [];
};

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
};

export default Sales;
