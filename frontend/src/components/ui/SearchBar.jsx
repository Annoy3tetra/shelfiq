import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowUpRight, 
  Book, 
  LayoutDashboard, 
  ShoppingCart, 
  Brain, 
  Plus, 
  Sparkles, 
  Command,
  CornerDownLeft
} from "lucide-react";
import { cn } from "../../utils/cn";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search books, orders, sales...",
  className = "",
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(value);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Update query when parent value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Handle Ctrl+K shortcut to focus input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle clicks outside the search bar to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Suggestions database
  const defaultSuggestions = [
    {
      category: "Navigation",
      items: [
        { label: "Go to Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "View Books Inventory", path: "/books", icon: Book },
        { label: "Track Sales & Orders", path: "/sales", icon: ShoppingCart },
        { label: "Insights AI & Demand Forecasting", path: "/insights-ai", icon: Brain },
      ]
    },
    {
      category: "Quick Actions",
      items: [
        { label: "Add a New Book Record", path: "/books?action=add", icon: Plus, action: () => navigate("/books") },
        { label: "Register New Sale", path: "/sales?action=new", icon: Sparkles, action: () => navigate("/sales") },
      ]
    }
  ];

  // Filter suggestions based on query
  const getFilteredSuggestions = () => {
    if (!query) return defaultSuggestions;

    const queryLower = query.toLowerCase();
    const filtered = [];

    // Filter default categories
    defaultSuggestions.forEach(cat => {
      const matchingItems = cat.items.filter(item => 
        item.label.toLowerCase().includes(queryLower)
      );
      if (matchingItems.length > 0) {
        filtered.push({
          category: cat.category,
          items: matchingItems
        });
      }
    });

    // Add query search options dynamically
    filtered.push({
      category: "Search Results",
      items: [
        { label: `Search books for "${query}"`, path: `/books?q=${query}`, icon: Search },
        { label: `Search sales for "${query}"`, path: `/sales?q=${query}`, icon: Search }
      ]
    });

    return filtered;
  };

  const filteredSuggestions = getFilteredSuggestions();
  // Flatten suggestions to simplify keyboard indexing
  const flatSuggestions = filteredSuggestions.flatMap(cat => cat.items);

  const handleKeyDown = (e) => {
    if (!focused) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatSuggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatSuggestions.length) % flatSuggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < flatSuggestions.length) {
        const selected = flatSuggestions[activeIndex];
        triggerAction(selected);
      } else {
        // If nothing is selected, trigger search callback or custom handler
        if (onChange) {
          onChange({ target: { value: query } });
        }
        setFocused(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      inputRef.current?.blur();
      setFocused(false);
    }
  };

  const triggerAction = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    setFocused(false);
    setActiveIndex(-1);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1); // Reset highlight index
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <motion.label
        animate={focused ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:focus-within:bg-slate-950/40 cursor-text",
          focused && "shadow-sm border-blue-500/80 ring-4 ring-blue-500/10"
        )}
      >
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setFocused(true);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 py-1"
        />
        
        {/* Hotkey Badge */}
        {!focused && (
          <div className="hidden items-center gap-0.5 rounded border border-slate-200/80 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex select-none">
            <Command size={10} />
            <span>K</span>
          </div>
        )}
      </motion.label>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {focused && flatSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 mt-2 max-h-[380px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900"
          >
            {filteredSuggestions.map((cat, catIdx) => {
              // Calculate correct global indexes for elements
              let previousItemsCount = 0;
              for (let i = 0; i < catIdx; i++) {
                previousItemsCount += filteredSuggestions[i].items.length;
              }

              return (
                <div key={cat.category} className="mb-3 last:mb-0">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {cat.category}
                  </div>
                  <div className="space-y-0.5">
                    {cat.items.map((item, itemIdx) => {
                      const globalIdx = previousItemsCount + itemIdx;
                      const isActive = globalIdx === activeIndex;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          onClick={() => triggerAction(item)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                            isActive 
                              ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400" 
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className={isActive ? "text-blue-500" : "text-slate-400"} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          
                          {isActive ? (
                            <div className="flex items-center gap-1 text-xs text-blue-500/70">
                              <span className="font-semibold text-[10px]">Select</span>
                              <CornerDownLeft size={10} className="stroke-[2.5]" />
                            </div>
                          ) : (
                            <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
