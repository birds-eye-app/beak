import html2canvas from "html2canvas";
import { ErrorInfo } from "react";
import { ChirpedContextType } from "./contexts/Chirped";

export function makeNewChirpedContext(): ChirpedContextType {
  return {
    allObservations: [],
    yearObservations: [],
    lifeList: [],
    rankings: {
      mostObservedByChecklistFrequency: [],
      mostObservedByTotalCount: [],
      topHotspotsByChecklists: [],
      topHotspotsByTimeSpent: [],
    },
    yearStats: {
      species: 0,
      checklists: 0,
      newLifersCount: 0,
      totalTimeSpentMinutes: 0,
      totalDistanceKm: 0,
      totalBirdsCounted: 0,
      numberOfSpuhs: 0,
      checklistsByType: {
        incidental: 0,
        stationary: 0,
        traveling: 0,
      },
      families: 0,
      genera: 0,
      numberOfHotspots: 0,
    },
  };
}

export const onError = (error: Error, info: ErrorInfo) => {
  console.error(error, info);
};

export async function exportComponentAsBlob(element: HTMLElement) {
  console.debug("Exporting component as image...", element);
  const canvas = await html2canvas(element);
  return canvas.toDataURL("image/png", 1.0);
}
export async function exportComponentAsImage(
  element: HTMLElement,
  imageFileName: string,
) {
  console.debug("Exporting component as image...", element);
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);
  downloadImage(image, imageFileName);
}

const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style.display = "none";
  fakeLink.download = fileName;

  fakeLink.href = blob;

  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
};
