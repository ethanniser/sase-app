import { z } from "zod";

const database = [
  "Pikachu",
  "Charizard",
  "Bulbasaur",
  "Squirtle",
  "Eevee",
  "Mewtwo",
  "Gengar",
  "Jigglypuff",
  "Lucario",
  "Greninja",
  "Snorlax",
  "Meowth",
  "Lapras",
  "Dragonite",
  "Alakazam",
  "Blaziken",
  "Gardevoir",
  "Umbreon",
  "Rayquaza",
  "Togepi",
];

const queryValidator = z.string().max(50);
function wait(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
export const GET = async (req: Request): Promise<Response> => {
  const rawQuery = new URL(req.url).searchParams.get("query");
  const parsedQuery = queryValidator.parse(rawQuery);
  // normalize names to lowercase
  const searchResults =
    parsedQuery !== ""
      ? database.filter((name) =>
          name.toLowerCase().startsWith(parsedQuery.toLowerCase()),
        )
      : database;
  await wait(400); // artifical delay so we can see loading indicator on frontend
  return Response.json({
    searchResults,
  });
};
