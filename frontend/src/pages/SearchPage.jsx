// SearchPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Virtuoso } from "react-virtuoso";
import {
  Search,
  User,
  Music2,
  Hash,
  MapPin,
  Loader2,
} from "lucide-react";

const TABS = ["For You", "Accounts", "Audio", "Tags", "Places"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("For You");

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch Search Results
  const fetchResults = useCallback(
    async (currentPage = 1, reset = false) => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/search`,
          {
            params: {
              q: query,
              type: activeTab.toLowerCase(),
              page: currentPage,
              limit: 30,
            },
          }
        );

        const newResults = res.data.results;

        if (reset) {
          setResults(newResults);
        } else {
          setResults((prev) => [...prev, ...newResults]);
        }

        setHasMore(res.data.hasMore);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [query, activeTab]
  );

  // Search whenever query/tab changes
  useEffect(() => {
    setPage(1);

    if (query.trim() !== "") {
      fetchResults(1, true);
    } else {
      setResults([]);
    }
  }, [query, activeTab, fetchResults]);

  // Infinite Scroll
  const loadMore = async () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    await fetchResults(nextPage);
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-zinc-800 px-4 py-3">
        {/* Search Input */}
        <div className="flex items-center bg-zinc-900 rounded-xl px-3 py-2">
          <Search size={18} className="text-zinc-400" />

          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none flex-1 px-3 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-5 mt-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm whitespace-nowrap pb-2 transition-all ${
                activeTab === tab
                  ? "text-white border-b border-white"
                  : "text-zinc-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        {results.length === 0 && query ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            No Results Found
          </div>
        ) : (
          <Virtuoso
            style={{ height: "100%" }}
            data={results}
            endReached={loadMore}
            itemContent={(index, item) => (
              <SearchCard item={item} />
            )}
            components={{
              Footer: () =>
                loading ? (
                  <div className="flex justify-center py-5">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : null,
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* Search Card */
/* ------------------------------------------------ */

function SearchCard({ item }) {
  const renderIcon = () => {
    switch (item.type) {
      case "audio":
        return <Music2 size={20} />;
      case "tag":
        return <Hash size={20} />;
      case "place":
        return <MapPin size={20} />;
      default:
        return <User size={20} />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900 transition">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={item.profilePic}
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* User Details */}
        <div>
          <h3 className="font-semibold text-sm">
            {item.username || item.title}
          </h3>

          <p className="text-zinc-400 text-xs">
            {item.name || item.subtitle}
          </p>
        </div>
      </div>

      <div className="text-zinc-400">
        {renderIcon()}
      </div>
    </div>
  );
}