import mapboxgl, { GeoJSONSource, Map, Marker } from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { useDebounce } from "use-debounce";
import { WaitAndUploadModal } from "./WaitAndUploadModal";
import {
  fetchLifers,
  fetchNearbyObservations,
  lifersToGeoJson,
  nearbyObservationsToGeoJson,
} from "./api";
import { BarLoader } from "react-spinners";
import {
  RootLayerIDs,
  allLayerIdRoots,
  allSubLayerIds,
  INITIAL_CENTER,
  INITIAL_ZOOM,
} from "./constants";
import { addSourceAndLayer } from "./map";

const LayerToggle = ({
  id,
  label,
  checked,
  onClick,
}: {
  id: RootLayerIDs;
  label: string;
  checked: boolean;
  onClick: (e: { target: { id: string } }) => void;
}) => {
  return (
    <div className="sidebar-right">
      <label>
        <input type="radio" id={id} checked={checked} onChange={onClick} />
        {label}
      </label>
    </div>
  );
};

function BirdMap() {
  const mapRef = useRef<Map>();
  const mapContainerRef = useRef<HTMLElement>();

  const [center, setCenter] = useState(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [debouncedCenter] = useDebounce(center, 500);

  const [activeLayerId, setActiveLayerId] = useState(
    RootLayerIDs.HistoricalLifers,
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [fileId, setFileId] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(true);

  useEffect(() => {
    if (fileId === "") return;
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    mapRef.current!.on("load", () => {
      fetchLifers(INITIAL_CENTER.lat, INITIAL_CENTER.lng, fileId).then(
        (data) => {
          const lifersFeatures = lifersToGeoJson(data);
          addSourceAndLayer(
            mapRef.current!,
            RootLayerIDs.HistoricalLifers,
            lifersFeatures,
            activeLayerId === RootLayerIDs.HistoricalLifers
              ? "visible"
              : "none",
          );
        },
      );

      fetchNearbyObservations(
        INITIAL_CENTER.lat,
        INITIAL_CENTER.lng,
        fileId,
      ).then((data) => {
        addSourceAndLayer(
          mapRef.current!,
          RootLayerIDs.NewLifers,
          nearbyObservationsToGeoJson(data),
          activeLayerId === RootLayerIDs.NewLifers ? "visible" : "none",
        );
      });

      setMapLoaded(true);
    });

    // update map state on move so that we can use the lat/long values elsewhere (fetching data, etc)
    mapRef.current!.on("move", () => {
      const mapCenter = mapRef.current!.getCenter();
      const mapZoom = mapRef.current!.getZoom();

      // update state
      setCenter({ lng: mapCenter.lng, lat: mapCenter.lat });
      setZoom(mapZoom);
    });

    return () => {
      mapRef.current!.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  useEffect(() => {
    if (!mapRef.current) return;
    const markers: { [key: string]: Marker } = {};
    const markersOnScreen: { [key: string]: { [key: string]: Marker } } = {};

    const updateMarkers = () => {
      if (activeLayerId !== RootLayerIDs.NewLifers) return;
      // reset markers on screen for other layers
      for (const rootLayer in markersOnScreen) {
        if (rootLayer !== activeLayerId) {
          console.log(`removing markers for ${rootLayer}`);
          for (const id in markersOnScreen[rootLayer]) {
            markersOnScreen[rootLayer][id].remove();
          }
        }
      }

      const newMarkers: { [key: string]: Marker } = {};
      const features = mapRef.current!.querySourceFeatures(activeLayerId);

      console.log(`updating markers for ${activeLayerId}: ${features.length}`);

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (const feature of features) {
        // @ts-expect-error untyped feature
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        if (!props?.cluster) continue;
        const id = props.cluster_id;

        let marker = markers[id];
        if (!marker) {
          // @ts-expect-error untyped props
          const el = createCustomHTMLMarker(props);
          marker = markers[id] = new mapboxgl.Marker({
            // @ts-expect-error mismatched types
            element: el,
          }).setLngLat(coords);
        }
        newMarkers[id] = marker;

        if (!markersOnScreen[id]) marker.addTo(mapRef.current!);
      }
      // for every marker we've added previously, remove those that are no longer visible
      let deleted = 0;
      for (const id in markersOnScreen[activeLayerId]) {
        if (!newMarkers[id]) {
          markersOnScreen[activeLayerId][id].remove();
          deleted++;
        }
      }
      console.log(
        `markers updated for ${activeLayerId}, deleted: ${deleted}, added ${Object.keys(newMarkers).length}`,
      );

      markersOnScreen[activeLayerId] = newMarkers;
    };

    // after the GeoJSON data is loaded, update markers on the screen on every frame
    mapRef.current.on("render", () => {
      if (!mapRef.current!.isSourceLoaded(activeLayerId)) return;
      console.log("rendering");
      updateMarkers();
    });
  }, [activeLayerId]);

  useEffect(() => {
    if (!mapLoaded) return;

    allLayerIdRoots.forEach((rootLayerId) => {
      const layerIds = allSubLayerIds.map(
        (subLayerId) => `${rootLayerId}.${subLayerId}`,
      );
      layerIds.forEach((layerId) => {
        if (mapRef.current!.getLayer(layerId)) {
          const visibility = activeLayerId === rootLayerId ? "visible" : "none";
          console.log(`Setting visibility for ${layerId} to ${visibility}`);
          mapRef.current!.setLayoutProperty(layerId, "visibility", visibility);
        }
      });
    });
  }, [activeLayerId, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded) return;
    if (activeLayerId !== RootLayerIDs.NewLifers) return;

    setShowLoading(true);
    fetchNearbyObservations(debouncedCenter.lat, debouncedCenter.lng, fileId)
      .then((data) => {
        const lifersSource = mapRef.current!.getSource(
          RootLayerIDs.NewLifers,
        ) as GeoJSONSource | undefined;
        if (!lifersSource) return;
        lifersSource.setData({
          type: "FeatureCollection",
          features: nearbyObservationsToGeoJson(data),
        });
      })
      .finally(() => {
        setShowLoading(false);
      });
  }, [debouncedCenter.lat, debouncedCenter, mapLoaded, fileId, activeLayerId]);

  const handleClick = useCallback((e: { target: { id: string } }) => {
    console.log(`clicked on ${e.target.id}`);
    setActiveLayerId(e.target.id as RootLayerIDs);
  }, []);

  return (
    <div className="root-container">
      <WaitAndUploadModal
        showModal={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
        }}
        onUploadComplete={(fileId: string) => {
          setFileId(fileId);
          setShowUploadModal(false);
        }}
        canClose={fileId !== ""}
      />
      <div className="topBar" style={{ flexDirection: "column" }}>
        <LayerToggle
          id={RootLayerIDs.HistoricalLifers}
          label="Show historical lifers"
          checked={activeLayerId === RootLayerIDs.HistoricalLifers}
          onClick={handleClick}
        />
        <LayerToggle
          id={RootLayerIDs.NewLifers}
          label="Show potential new lifers. Note: you need be fairly zoomed in for these to display properly."
          checked={activeLayerId === RootLayerIDs.NewLifers}
          onClick={handleClick}
        />
        <button onClick={() => setShowUploadModal(true)}>Change CSV</button>
      </div>
      <div
        id="map-container"
        // @ts-expect-error something something ref error
        ref={mapContainerRef!}
      />
      {showLoading && <BarLoader className="loadingBar" width={200} />}
      <div className="sidebar">
        Longitude: {center.lng.toFixed(4)} | Latitude: {center.lat.toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
    </div>
  );
}

function createCustomHTMLMarker(props: {
  [x: string]: unknown;
  species_codes: string;
}) {
  const speciesCodes = [...new Set(props.species_codes.split(","))].filter(
    (code) => code.trim().length > 1,
  );

  let classification = "";
  if (speciesCodes.length <= 10) {
    classification = "small";
  } else if (speciesCodes.length <= 50) {
    classification = "medium";
  } else {
    classification = "large";
  }
  let radius = 30;
  let backgroundColor = "#fadd00";
  switch (classification) {
    case "small":
      break;
    case "medium":
      radius = 30;
      backgroundColor = "#F2C74D";
      break;
    case "large":
      radius = 50;
      backgroundColor = "#ff70ba";
      break;
  }
  const width = radius;
  const height = radius;

  const html = `<div>
        <circle class="cluster-classification" class="cluster-classification-${classification}" style="width: ${width}px; height: ${height}px; background-color: ${backgroundColor};">
          <text dominant-baseline="central">
            ${speciesCodes.length}
          </text>
        </circle>
      </div>`;

  const el = document.createElement("div");
  el.innerHTML = html;
  return el.firstChild!;
}

function App() {
  return (
    <>
      <BirdMap />
    </>
  );
}

export default App;
