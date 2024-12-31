import { expect, test } from "vitest";
import {
  parseTaxonomy,
  Taxonomy,
  parseTaxonomyToJson,
} from "../../../chirped/taxonomy/parse";

test("parseTaxonomy", async () => {
  const results = await parseTaxonomy();
  expect(results.length).toBe(17415);

  // check if we can use sci name as a unique key
  const uniqueKeys = new Set<string>();
  results.forEach((result) => {
    uniqueKeys.add(result.scientificName);
  });
  expect(uniqueKeys.size).toBe(results.length);

  const expected = {
    bandingCodes: "",
    category: "species",
    comNameCodes: "COOS",
    commonName: "Common Ostrich",
    extinct: false,
    extinctYear: undefined,
    familyCode: "struth1",
    familyComName: "Ostriches",
    familySciName: "Struthionidae",
    order: "Struthioniformes",
    reportAs: "",
    sciNameCodes: "STCA",
    scientificName: "Struthio camelus",
    speciesCode: "ostric2",
    taxonOrder: 2,
  } as Taxonomy;

  const first = results[0];

  expect(first).toEqual(expected);
});

test("parseTaxonomyToJson", async () => {
  await parseTaxonomyToJson();
});
