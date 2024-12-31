import { Observation, parseObservations } from "../../chirped/parse";
import * as path from "path";
import * as fs from "fs";
import { expect, test } from "vitest";

test("parseObservations", async () => {
  const csvFilePath = path.join(__dirname, "MyEBirdData.csv");
  const csvData = fs.readFileSync(csvFilePath, "utf8");
  const actual = await parseObservations(csvData);

  expect(actual.length).toBe(4826);
  const first = actual[0];

  // S162264673,Snow Goose,Anser caerulescens,257,5,US-NY,Queens,L109145,Jamaica Bay Wildlife Refuge--West Pond,40.6188482,-73.8307995,2024-02-19,10:26 AM,eBird - Traveling Count,203,1,5.057,,2
  const expected: Observation = {
    submissionId: "S162264673",
    commonName: "Snow Goose",
    scientificName: "Anser caerulescens",
    taxonomicOrder: 257,
    count: 5,
    stateProvince: "US-NY",
    county: "Queens",
    locationId: "L109145",
    location: "Jamaica Bay Wildlife Refuge--West Pond",
    latitude: 40.6188482,
    longitude: -73.8307995,
    date: "2024-02-19",
    time: "10:26 AM",
    dateTime: new Date("2024-02-19 10:26 AM"),
    protocol: "eBird - Traveling Count",
    durationMinutes: 203,
    allObsReported: true,
    distanceTraveledKm: 5.057,
    areaCoveredHa: undefined,
    numberOfObservers: 2,
    mlCatalogNumbers: undefined,
    observationDetails: undefined,
    breedingCode: undefined,
    checklistComments: undefined,
  };

  expect(first).toEqual(expected);

  // check that all have their dates parsed correctly
  const invalidDates = actual.filter((obs) => isNaN(obs.dateTime.getTime()));
  expect(invalidDates.length).toBe(0);
});
