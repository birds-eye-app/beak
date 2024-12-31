import { ChirpedContextType } from "./Context";

export function makeNewChirpedContext(): ChirpedContextType {
  return {
    allObservations: [],
    yearObservations: [],
    lifeList: [],
    yearStats: {
      species: 0,
      checklists: 0,
      newLifersCount: 0,
      totalTimeSpentMinutes: 0,
      totalDistanceKm: 0,
      totalBirdsCounted: 0,
      mostObservedByChecklistFrequency: [],
      mostObservedByTotalCount: [],
      mostObservedFamilies: [],
      numberOfSpuhs: 0,
      topHotspots: [],
    },
  };
}
