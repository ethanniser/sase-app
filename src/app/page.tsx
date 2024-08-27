"use client";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

const responseValidator = z.object({
  searchResults: z.array(z.string()),
});
export default function Home() {
  const [query, setQuery] = useState<string | null>(null);
  const deboundedQuery = useDebounce(query, 300);
  const results = useQuery({
    queryFn: async () => {
      const res = await fetch(`/api/search?query=${deboundedQuery}`);
      const json = await res.json();
      const { searchResults } = responseValidator.parse(json);
      return searchResults;
    },
    queryKey: ["search", { query }],
    enabled: deboundedQuery == null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await results.refetch();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={query ?? undefined}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-grow"
        />
        <Button
          type="submit"
          disabled={results.isFetching}
          className="shrink-0"
        >
          {results.isFetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
      {results.isError && (
        <p className="text-red-500 text-sm mb-4">
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
        <p>no results</p>
      )}
    </div>
  );
}
