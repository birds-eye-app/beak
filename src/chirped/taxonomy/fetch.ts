import { Taxonomy } from "./parse";

import parsedTaxonomy from "./taxonomy.json" assert { type: "json" };

const taxonomy = parsedTaxonomy as Record<string, Taxonomy>;

export function fetchTaxonomyForSpecies(scientificName: string): Taxonomy {
  return taxonomy[scientificName];
}
