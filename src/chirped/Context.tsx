import { createContext } from "react";
import { HotSpotStatsRanking, SpeciesStatsRanking } from "./calculate";
import { makeNewChirpedContext } from "./helpers";
import { Observation } from "./parseEbirdExport";

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
    // families seen
    families: number;
    genera: number;
    // top hotspots
    topHotspots: HotSpotStatsRanking;
    // total time spent birding in minutes
    totalTimeSpentMinutes: number;
    // total distance traveled in kilometers
    totalDistanceKm: number;
    numberOfSpuhs: number;
    checklistsByType: {
      incidental: number;
      stationary: number;
      traveling: number;
    };
  };
};

export const ChirpedContext = createContext<ChirpedContextType>(
  makeNewChirpedContext(),
);
