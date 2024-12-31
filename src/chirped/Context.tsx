import { createContext } from "react";
import { SpeciesStatsRanking } from "./calculate";
import { makeNewChirpedContext } from "./helpers";
import { Observation } from "./parse";

export type ChirpedContextType = {
  allObservations: Observation[];
  yearObservations: Observation[];
  lifeList: Observation[];
  yearStats: {
    // total number of species observed
    species: number;
    // total number of checklists submitted
    checklists: number;
    // total number of birds counted
    totalBirdsCounted: number;
    // count of new lifers observed
    newLifersCount: number;
    // most observed species
    mostObservedByChecklistFrequency: SpeciesStatsRanking;
    // species with highest total count
    mostObservedByTotalCount: SpeciesStatsRanking;
    // most observed families
    mostObservedFamilies: string[];
    // top hotspots
    topHotspots: string[];
    // total time spent birding in minutes
    totalTimeSpentMinutes: number;
    // total distance traveled in kilometers
    totalDistanceKm: number;
    numberOfSpuhs: number;
  };
};

export const ChirpedContext = createContext<ChirpedContextType>(
  makeNewChirpedContext(),
);
