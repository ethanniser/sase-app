"use client";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const responseValidator = z.object({
  searchResults: z.array(z.string()),
});

export default function Page() {
  const [query, setQuery] = useState<string>("");
  const deboundedQuery = useDebounce(query, 300);
  const results = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/search?query=${deboundedQuery}`);
      const json = await res.json();
      const { searchResults } = responseValidator.parse(json);
      return searchResults;
    },
    queryKey: ["search", { deboundedQuery }],
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="flex space-x-2 ">
        <Input
          type="text"
          value={query ?? undefined}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-grow"
        />
      </div>
      {!results.isLoading && query === "" && <h2>Search for pokemon!</h2>}
      {results.isLoading && <p className="text-sm">Loading...</p>}
      {results.isError && (
        <p className="text-red-500 text-sm">
          An error occurred while searching. Please try again.
        </p>
      )}
      {results.data && results.data.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {results.data.map((result) => (
            <li key={result} className="text-sm text-gray-700">
              {result}
            </li>
          ))}
        </ul>
      ) : (
        !results.isLoading && <p className="text-sm">no results</p>
      )}
    </div>
  );
}
