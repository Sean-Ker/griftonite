'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Search({ disabled }: { disabled?: boolean }) {
  const { push } = useRouter();
  const [term, setTerm] = useState('');
  const [isPending, setIsPending] = useState(false);

  function handleSearch() {
    if (term) {
      setIsPending(true);
      push(`/profile/${term}`);
    }
  }
  return (
    <div className="relative mt-5 max-w-3lg">
      <label htmlFor="search" className="sr-only">
        Search EVM Address
      </label>
      <div className="rounded-lg shadow-sm flex">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <MagnifyingGlassIcon
            className="mr-3 h-6 w-6 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          disabled={disabled}
          className="h-14 block w-full rounded-l-lg border border-gray-200 pl-12 focus:border-indigo-500 focus:ring-indigo-500 text-xl"
          placeholder="Search by name..."
          spellCheck={false}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-500 text-white rounded-r-lg px-4 font-bold text-xl disabled:opacity-50"
          disabled={disabled || isPending}
        >
          Search
        </button>
      </div>

      {isPending && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
