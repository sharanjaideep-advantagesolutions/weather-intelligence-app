import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { GeocodingResult } from '../types/weather';
import { searchCities } from '../services/openMeteo';

interface SearchBarProps {
  onSelectCity: (location: GeocodingResult) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const results = await searchCities(query.trim(), 6);
        setSuggestions(results);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch {
        // error will be caught during full search execution
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    // Direct submit: search city and pick first match
    setIsSearchingSuggestions(true);
    try {
      const results = await searchCities(query.trim(), 1);
      if (results && results.length > 0) {
        handleSelect(results[0]);
      } else {
        // synthesize custom invalid target to trigger the robust error flow
        onSelectCity({
          id: -1,
          name: query.trim(),
          latitude: 0,
          longitude: 0,
        });
        setIsOpen(false);
      }
    } catch {
      onSelectCity({
        id: -1,
        name: query.trim(),
        latitude: 0,
        longitude: 0,
      });
      setIsOpen(false);
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  const handleSelect = (item: GeocodingResult) => {
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
    onSelectCity(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          {isLoading || isSearchingSuggestions ? (
            <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search city name (e.g. San Francisco, Tokyo, Berlin, Sydney)..."
          className="w-full pl-12 pr-28 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm md:text-base focus:outline-none focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-lg shadow-black/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-20 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-50 divide-y divide-slate-800/60 backdrop-blur-md">
          {suggestions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const regionDetails = [item.admin1, item.country].filter(Boolean).join(', ');
            return (
              <button
                key={`${item.id}-${idx}`}
                type="button"
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-800/80 text-white' : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-medium text-slate-100">{item.name}</span>
                    {regionDetails && (
                      <span className="ml-2 text-xs text-slate-400 truncate">
                        {regionDetails}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 shrink-0 ml-4">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
