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

export const POST = (req: Request): Response => {
  const rawQuery = new URL(req.url).searchParams.get("query");
  const parsedQuery = queryValidator.parse(rawQuery);
  const searchResults = database.filter((name) => name.includes(parsedQuery));
  return Response.json({
    searchResults,
  });
};
