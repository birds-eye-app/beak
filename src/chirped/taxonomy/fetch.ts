import { Taxonomy } from "./parse";

import parsedTaxonomy from "./taxonomy.json" assert { type: "json" };

export const eBirdTaxonomy = parsedTaxonomy as Record<string, Taxonomy>;

export function fetchTaxonomyForSpecies(scientificName: string): Taxonomy {
  return eBirdTaxonomy[scientificName];
}
