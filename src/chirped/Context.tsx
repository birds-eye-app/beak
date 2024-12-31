import { createContext } from "react";
import { Observation } from "./parse";
import { makeNewChirpedContext } from "./helpers";

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
    // list of new lifers observed
    newLifers: Observation[];
    // count of new lifers observed
    newLifersCount: number;
    // most observed species
    mostObserved: string;
    // most observed family
    topFamily: string;
    // total time spent birding in minutes
    totalTimeSpentMinutes: number;
    // total distance traveled in kilometers
    totalDistanceKm: number;
  };
};

export const ChirpedContext = createContext<ChirpedContextType>(
  makeNewChirpedContext(),
);
