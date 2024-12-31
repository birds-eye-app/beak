import { ChirpedContextType } from "./Context";

export function makeNewChirpedContext(): ChirpedContextType {
  return {
    allObservations: [],
    yearObservations: [],
    lifeList: [],
    yearStats: {
      species: 0,
      checklists: 0,
      newLifers: [],
      newLifersCount: 0,
      mostObserved: "",
      topFamily: "",
      totalTimeSpentMinutes: 0,
      totalDistanceKm: 0,
      totalBirdsCounted: 0,
    },
  };
}
