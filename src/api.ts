const apiBaseUrl = import.meta.env.VITE_BASE_URL;

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
}

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
