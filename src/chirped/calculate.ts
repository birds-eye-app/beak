import { ChirpedContextType } from "./Context";
import { makeNewChirpedContext } from "./helpers";
import { Observation } from "./parse";

export function shouldIncludeInSpeciesCounts(observation: Observation) {
  // common name filters
  // we won't include:
  // - spuhs: `gull sp.` or `sparrow sp.`
  // - hybrids: `Mallard x American Black Duck`
  if (
    observation.commonName.includes("sp.") ||
    observation.commonName.includes("(hybrid)")
  ) {
    return false;
  }

  // scientific name filters
  // exclude:
  // - groupings (genus species [something group])
  // - subspecies (genus species subspecies)

  if (
    observation.scientificName.includes("[") ||
    observation.scientificName.trim().split(" ").length > 2
  ) {
    return false;
  }

  return true;
}

export function shouldIncludeObservationForYear(
  observation: Observation,
  currentYear: number,
) {
  return observation.dateTime.getFullYear() === currentYear;
}

export async function performChirpedCalculations(
  allObservations: Observation[],
  currentYear: number,
): Promise<ChirpedContextType> {
  const chirpedObservations = makeNewChirpedContext();

  console.debug(`running performChirpedCalculations for year ${currentYear}`);

  const sortedObservations = allObservations.sort(
    (a, b) => a.dateTime.getTime() - b.dateTime.getTime(),
  );

  console.debug("sorted observations", sortedObservations.length);

  const lifeList = new Set<string>();
  const speciesForYear = new Set<string>();
  const checklistsForYear = new Set<string>();

  console.debug("sample observation", sortedObservations[0]);

  for (const observation of sortedObservations) {
    chirpedObservations.allObservations.push(observation);

    if (
      !lifeList.has(observation.scientificName) &&
      shouldIncludeInSpeciesCounts(observation)
    ) {
      chirpedObservations.lifeList.push(observation);
      lifeList.add(observation.scientificName);
    }

    if (!shouldIncludeObservationForYear(observation, currentYear)) {
      continue;
    }

    if (typeof observation.count === "number" && !isNaN(observation.count)) {
      chirpedObservations.yearStats.totalBirdsCounted += observation.count;
    }

    if (!checklistsForYear.has(observation.submissionId)) {
      chirpedObservations.yearStats.checklists += 1;

      if (observation.durationMinutes && !isNaN(observation.durationMinutes)) {
        chirpedObservations.yearStats.totalTimeSpentMinutes +=
          observation.durationMinutes;
      }
      if (
        observation.distanceTraveledKm &&
        !isNaN(observation.distanceTraveledKm)
      ) {
        chirpedObservations.yearStats.totalDistanceKm +=
          observation.distanceTraveledKm;
      }
      checklistsForYear.add(observation.submissionId);
    }

    if (!shouldIncludeInSpeciesCounts(observation)) {
      continue;
    }
    chirpedObservations.yearObservations.push(observation);
    if (!speciesForYear.has(observation.scientificName)) {
      chirpedObservations.yearStats.species += 1;
      speciesForYear.add(observation.scientificName);
    }
  }

  console.debug("internal stats", {
    lifeList,
    speciesForYear,
    checklistsForYear,
  });
  console.debug("year stats", chirpedObservations.yearStats);

  return chirpedObservations;
}
