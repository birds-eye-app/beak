import { Feature, GeoJsonProperties, Geometry } from "geojson";
const apiBaseUrl = import.meta.env.VITE_BASE_URL;

export type Lifer = {
  common_name: string;
  latitude: number;
  longitude: number;
  date: string;
  taxonomic_order: number;
  location: string;
  location_id: string;
  species_code: string;
};

type Location = {
  location_name: string;
  latitude: number;
  longitude: number;
  location_id: string;
};

export type LocationToLifers = {
  location: Location;
  lifers: Lifer[];
};

export type LocationByLiferResponse = {
  [key: string]: LocationToLifers;
};

export function lifersToGeoJson(response: LocationByLiferResponse) {
  return Object.values(response).map((l) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [l.location.longitude, l.location.latitude],
      },
      properties: {
        title: l.location.location_name,
        lifers: l.lifers,
        liferCount: l.lifers.length,
        speciesCodes: l.lifers.map((lifer) => lifer.species_code).join(","),
      },
    } as Feature<Geometry, GeoJsonProperties>;
  });
}

export function nearbyObservationsToGeoJson(
  lifers: LocationByLiferResponse,
): Feature<Geometry, GeoJsonProperties>[] {
  if (!lifers) return [];
  return Object.values(lifers).flatMap((entry) => {
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [entry.location.longitude, entry.location.latitude],
      },
      properties: {
        title: entry.location.location_name,
        lifers: entry.lifers,
        liferCount: entry.lifers.length,
        speciesCodes: entry.lifers.map((lifer) => lifer.species_code).join(","),
      },
    };

    return feature as Feature<Geometry, GeoJsonProperties>;
  });
}

// todo: dedupe all of this

export const uploadCsv = async (file: File) => {
  console.log("Uploading file:", file);
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiBaseUrl}v1/upload_lifers_csv`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Upload response:", data);
  return data as { key: string };
};

export const checkHealthy = async () => {
  try {
    // sleep 2s
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(`${apiBaseUrl}v1/health`);
    return response.ok;
  } catch (error) {
    console.error("Health check error:", error);
    return false;
  }
};

export const fetchLifers = async (
  latitude: number,
  longitude: number,
  fileId: string,
) => {
  const baseUrl = `${apiBaseUrl}v1/lifers_by_location`;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    file_id: fileId,
  });

  const url = `${baseUrl}?${params}`;

  try {
    const response = await fetch(url, {});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

export const fetchNearbyObservations = async (
  latitude: number,
  longitude: number,
  fileId: string,
) => {
  const baseUrl = `${apiBaseUrl}v1/nearby_observations`;

  // Create a URLSearchParams object to handle query parameters
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    file_id: fileId,
  });

  // Construct the full URL with query parameters
  const url = `${baseUrl}?${params}`;

  try {
    const response = await fetch(url, {});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
