import { describe, expect, test } from "vitest";
import {
  performChirpedCalculations,
  shouldIncludeInSpeciesCounts,
} from "../../chirped/calculate";
import { Observation, parseObservations } from "../../chirped/parse";
import * as path from "path";
import * as fs from "fs";
import { ChirpedContextType } from "../../chirped/Context";

const exampleObservation: Observation = {
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
};

describe("performChirpedCalculations", () => {
  describe("allObservations", async () => {
    const observations: Observation[] = [
      {
        ...exampleObservation,
        dateTime: new Date("2024-01-01T10:00:00Z"),
        date: "2024-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-02-01T10:00:00Z"),
        date: "2024-02-01",
        scientificName: "Species B",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2022-01-01T10:00:00Z"),
        date: "2022-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-03-01T10:00:00Z"),
        date: "2024-03-01",
        scientificName: "Species C",
      },
    ];

    const currentYear = 2024;
    const result = await performChirpedCalculations(observations, currentYear);

    test("should contain all observations", async () => {
      expect(result.allObservations.length).toBe(4);
    });
    test("should sort observations by date", async () => {
      expect(result.allObservations[0].date).toBe("2022-01-01");
      expect(result.allObservations[3].date).toBe("2024-03-01");
    });
  });

  describe("yearObservations", async () => {
    const observations: Observation[] = [
      {
        ...exampleObservation,
        dateTime: new Date("2024-01-01T10:00:00Z"),
        date: "2024-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-02-01T10:00:00Z"),
        date: "2024-02-01",
        scientificName: "Species B",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2022-01-01T10:00:00Z"),
        date: "2022-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-03-01T10:00:00Z"),
        date: "2024-03-01",
        scientificName: "Species C",
      },
    ];

    const currentYear = 2024;
    const result = await performChirpedCalculations(observations, currentYear);

    test("should only contain year observations", async () => {
      expect(result.yearObservations.length).toBe(3);
    });

    test("uses the current year argument", async () => {
      const result = await performChirpedCalculations(observations, 2022);
      expect(result.yearObservations.length).toBe(1);
    });
  });
  describe("lifers", async () => {
    const observations: Observation[] = [
      {
        ...exampleObservation,
        dateTime: new Date("2024-01-01T10:00:00Z"),
        date: "2024-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-02-01T10:00:00Z"),
        date: "2024-02-01",
        scientificName: "Species B",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2022-01-01T10:00:00Z"),
        date: "2022-01-01",
        scientificName: "Species A",
      },
      {
        ...exampleObservation,
        dateTime: new Date("2024-03-01T10:00:00Z"),
        date: "2024-03-01",
        scientificName: "Species C",
      },
    ];

    const currentYear = 2024;
    const result = await performChirpedCalculations(observations, currentYear);

    test("should only contain lifers", async () => {
      expect(result.lifeList.length).toBe(3);
    });

    test("should only contain the first observation of a species", async () => {
      const result = await performChirpedCalculations(observations, 2024);
      const speciesA = result.lifeList.filter(
        (obs) => obs.scientificName === "Species A",
      );

      expect(speciesA.length).toBe(1);
      expect(speciesA[0].date).toBe("2022-01-01");
    });

    test("works with my life list", async () => {
      const csvFilePath = path.join(__dirname, "MyEBirdData.csv");
      const csvData = fs.readFileSync(csvFilePath, "utf8");
      const actual = await parseObservations(csvData);
      const currentYear = 2024;

      const result = await performChirpedCalculations(actual, currentYear);

      expect(result.lifeList.length).toBe(599);
    });
  });

  describe("yearStats", async () => {
    test("should stats", async () => {
      const observations: Observation[] = [
        {
          ...exampleObservation,
          submissionId: "S1",
          dateTime: new Date("2024-01-01T10:00:00Z"),
          date: "2024-01-01",
          scientificName: "Species A",
          durationMinutes: 10,
          distanceTraveledKm: 1,
        },
        {
          ...exampleObservation,
          submissionId: "S2",
          dateTime: new Date("2024-02-01T10:00:00Z"),
          date: "2024-02-01",
          scientificName: "Species B",
          durationMinutes: 20,
          distanceTraveledKm: 2,
        },
        {
          ...exampleObservation,
          submissionId: "S3",
          dateTime: new Date("2024-03-01T10:00:00Z"),
          date: "2024-03-01",
          scientificName: "Species C",
          durationMinutes: 30,
          distanceTraveledKm: 3,
        },
        {
          ...exampleObservation,
          submissionId: "S3",
          dateTime: new Date("2024-03-01T10:00:00Z"),
          date: "2024-03-01",
          scientificName: "Species D",
          durationMinutes: 30,
          distanceTraveledKm: 3,
        },
      ];

      const currentYear = 2024;
      const result = await performChirpedCalculations(
        observations,
        currentYear,
      );
      const expectedStats = {
        species: 4,
        checklists: 3,
        newLifersCount: 4,
        totalTimeSpentMinutes: 60,
        totalDistanceKm: 6,
        totalBirdsCounted: 20,
        mostObservedByChecklistFrequency: [
          {
            species: "Snow Goose",
            totalCounts: 20,
            totalObservations: 4,
          },
        ],
        mostObservedByTotalCount: [
          {
            species: "Snow Goose",
            totalCounts: 20,
            totalObservations: 4,
          },
        ],
        mostObservedFamilies: [],
        numberOfSpuhs: 0,
        topHotspots: [],
      } as ChirpedContextType["yearStats"];

      expect(result.yearStats).toEqual(expectedStats);
    });

    test("with my own data", async () => {
      const csvFilePath = path.join(__dirname, "MyEBirdData.csv");
      const csvData = fs.readFileSync(csvFilePath, "utf8");
      const actual = await parseObservations(csvData);
      const currentYear = 2024;

      const result = await performChirpedCalculations(actual, currentYear);

      const expectedStats = {
        species: 593,
        checklists: 355,
        newLifersCount: 452,
        totalTimeSpentMinutes: 22629,
        totalDistanceKm: 653.4519999999999,
        totalBirdsCounted: 22262,
        mostObservedByChecklistFrequency: [
          {
            species: "American Robin",
            totalCounts: 1072,
            totalObservations: 155,
          },
          {
            species: "European Starling",
            totalCounts: 1365,
            totalObservations: 122,
          },
          {
            species: "House Sparrow",
            totalCounts: 1031,
            totalObservations: 111,
          },
          {
            species: "Northern Cardinal",
            totalCounts: 304,
            totalObservations: 105,
          },
          {
            species: "Mourning Dove",
            totalCounts: 450,
            totalObservations: 98,
          },
        ],
        mostObservedByTotalCount: [
          {
            species: "European Starling",
            totalCounts: 1365,
            totalObservations: 122,
          },
          {
            species: "American Robin",
            totalCounts: 1072,
            totalObservations: 155,
          },
          {
            species: "House Sparrow",
            totalCounts: 1031,
            totalObservations: 111,
          },
          {
            species: "American Coot",
            totalCounts: 865,
            totalObservations: 15,
          },
          {
            species: "Canada Goose",
            totalCounts: 697,
            totalObservations: 76,
          },
        ],
        mostObservedFamilies: [],
        numberOfSpuhs: 22,
        topHotspots: [],
      } as ChirpedContextType["yearStats"];

      expect(result.yearStats).toEqual(expectedStats);
    });
  });
});

describe("shouldIncludeInSpeciesCounts", () => {
  test("filters based on common names", async () => {
    const commonNameTests = ["gull sp.", "Graylag x Swan Goose (hybrid)"];

    for (const commonName of commonNameTests) {
      const observation: Observation = {
        ...exampleObservation,
        commonName,
      };
      expect(shouldIncludeInSpeciesCounts(observation)).toBe(false);
    }
  });
  test("filters based on scientific names", async () => {
    const commonNameTests = ["gull sp.", "Graylag x Swan Goose (hybrid)"];

    for (const commonName of commonNameTests) {
      const observation: Observation = {
        ...exampleObservation,
        commonName,
      };
      expect(shouldIncludeInSpeciesCounts(observation)).toBe(false);
    }
  });
});
