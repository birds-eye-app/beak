import { Feature, GeoJsonProperties, Geometry } from "geojson";
import mapboxgl, { GeoJSONSource, Map, Marker } from "mapbox-gl";
import { act, useCallback, useEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

import { useDebounce } from "use-debounce";
import { WaitAndUploadModal } from "./WaitAndUploadModal";
import { fetchLifers, fetchNearbyObservations } from "./api";

const INITIAL_CENTER = {
  lng: -74.0242,
  lat: 40.6941,
};
const INITIAL_ZOOM = 10.12;

enum RootLayerIDs {
  HistoricalLifers = "historical_lifers",
  NewLifers = "new_lifers",
}

const allLayerIdRoots = [RootLayerIDs.HistoricalLifers, RootLayerIDs.NewLifers];

enum SubLayerIDs {
  ClusterCircles = "cluster_circles",
  ClusterCount = "cluster_count",
  UnclusteredPointsLabel = "unclustered_points_label",
  UnclusteredPointsCircle = "unclustered_point_circle",
  UnclusteredPointsCount = "unclustered_point_count",
}

const allSubLayerIds = [
  SubLayerIDs.ClusterCircles,
  SubLayerIDs.ClusterCount,
  SubLayerIDs.UnclusteredPointsLabel,
  SubLayerIDs.UnclusteredPointsCircle,
  SubLayerIDs.UnclusteredPointsCount,
];

type Lifer = {
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

type LocationToLifers = {
  location: Location;
  lifers: Lifer[];
};

type LocationByLiferResponse = {
  [key: string]: LocationToLifers;
};

function lifersToGeoJson(response: LocationByLiferResponse) {
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

function addSourceAndLayer(
  mapRef: Map,
  sourceId: RootLayerIDs,
  features: Feature<Geometry, GeoJsonProperties>[],
  visibility: "visible" | "none",
) {
  console.log(
    `Adding source and layer for ${sourceId}, visibility: ${visibility}`,
  );
  console.log("example feature", features[0]);
  mapRef.addSource(sourceId, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: features,
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {
      sum: ["+", ["get", "liferCount", ["properties"]]],
      species_codes: [
        "concat",
        ["concat", ["get", "speciesCodes", ["properties"]], ","],
      ],
      distinct_species_codes: [
        // ['accumulated'] is the current value iterated during the reduce (the property is defined at [1])
        // ['get', 'distinctCountries'] is the accumulated / concatenated string
        [
          // Concat accumulated value + current value if not present in accumulated
          "concat",
          ["get", "distinct_species_codes"],
          [
            "case",
            ["in", ["accumulated"], ["get", "distinct_species_codes"]], // If accumulated (user_id) has already been added
            "", // Add EMPTY string
            ["concat", ", ", ["accumulated"]], // Add the user_id (concatenated with a comma in your case)
          ],
        ],
        ["get", "speciesCodes", ["properties"]], // [1]: source marker property iterated in the custom reduce function
      ],
    },
  });

  // mapRef.addLayer({
  //   id: `${sourceId}.${SubLayerIDs.ClusterCircles}`,
  //   type: "circle",
  //   source: sourceId,
  //   filter: ["has", "point_count"],
  //   paint: {
  //     "circle-stroke-color": "white",
  //     "circle-stroke-width": 0.5,
  //     "circle-color": [
  //       "interpolate",
  //       ["linear", 0.5],
  //       ["get", "sum"],
  //       15,
  //       "#fadd00",
  //       250,
  //       "#ff70ba",
  //     ],
  //     "circle-radius": [
  //       "interpolate",
  //       ["linear"],
  //       ["get", "sum"],
  //       10,
  //       15,
  //       250,
  //       40,
  //     ],
  //   },
  //   layout: {
  //     visibility: visibility,
  //   },
  // });

  // if (sourceId === RootLayerIDs.HistoricalLifers) {
  //   mapRef.addLayer({
  //     id: `${sourceId}.${SubLayerIDs.ClusterCount}`,
  //     type: "symbol",
  //     source: sourceId,
  //     filter: ["has", "point_count"],
  //     layout: {
  //       "text-field": ["get", "sum"],
  //       "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  //       "text-size": 12,
  //       visibility: visibility,
  //     },
  //   });
  // }

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.UnclusteredPointsCircle}`,
    type: "circle",
    source: sourceId,
    filter: ["!", ["has", "point_count"]],
    layout: {
      visibility: visibility,
    },
    paint: {
      "circle-stroke-color": "black",
      "circle-stroke-width": 2,
      "circle-color": [
        "interpolate",
        ["linear", 0.5],
        ["get", "liferCount"],
        15,
        "#fadd00",
        250,
        "#ff70ba",
      ],
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "liferCount"],
        10,
        10,
        250,
        40,
      ],
    },
  });

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.UnclusteredPointsCount}`,
    type: "symbol",
    source: sourceId,
    filter: ["!", ["has", "point_count"]],
    layout: {
      "text-field": ["get", "liferCount"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
      visibility: visibility,
    },
  });

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.UnclusteredPointsLabel}`,
    type: "symbol",
    filter: ["!", ["has", "point_count"]],
    source: sourceId,
    layout: {
      "text-field": ["get", "title"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-offset": [0, 1.25],
      "text-size": 15,
      "text-anchor": "top",
      "icon-size": 0.5,
      visibility: visibility,
    },
  });

  // inspect a cluster on click
  mapRef.on("click", `${sourceId}.${SubLayerIDs.ClusterCircles}`, (e) => {
    const features = mapRef.queryRenderedFeatures(e.point, {
      layers: [`${sourceId}.${SubLayerIDs.ClusterCircles}`],
    });
    const clusterId = features[0].properties?.cluster_id;
    mapRef
      .getSource<GeoJSONSource>(sourceId)!
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        mapRef.easeTo({
          // @ts-expect-error untyped event
          center: features[0].geometry.coordinates,
          zoom: zoom! + 1,
        });
      });
  });

  mapRef.on(
    "click",
    `${sourceId}.${SubLayerIDs.UnclusteredPointsCircle}`,
    (e) => {
      // @ts-expect-error untyped event
      const coordinates = e.features[0].geometry.coordinates.slice();
      // @ts-expect-error untyped event
      const lifers = JSON.parse(e.features[0].properties.lifers);

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      const html: string[] = [
        '<div style="max-height: 200px; overflow-y: auto;">',
      ];
      lifers.map((lifer: Lifer) => {
        html.push(`<div>${lifer.date} - ${lifer.common_name} </div>`);
      });
      html.push("</div>");

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(html.join("\n"))
        .addTo(mapRef);
    },
  );
}

function nearbyObservationsToGeoJson(
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
  const [showUploadModal, setShowUploadModal] = useState(true);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [markersOnScreen, setMarkersOnScreen] = useState<{ [key: string]: {[key: string]: Marker} }>({});

  const updateMarkers = useCallback((activeLayerId: RootLayerIDs) => {
    // reset markers on screen for other layers
    for (const key in markersOnScreen) {
      if (key !== activeLayerId) {
        for (const id in markersOnScreen[key]) {
          markersOnScreen[key][id].remove();
        }
      }
    }

    const newMarkers: { [key: string]: Marker } = {};
    const features = mapRef.current!.querySourceFeatures(activeLayerId);

    // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
    // and add it to the map if it's not there already
    for (const feature of features) {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;
      if (!props?.cluster) continue;
      const id = props.cluster_id;

      let marker = markers[id];
      if (!marker) {
        const el = createCustomHTMLMarker(props);
        marker = markers[id] = new mapboxgl.Marker({
          element: el,
        }).setLngLat(coords);
      }
      newMarkers[id] = marker;

      if (!markersOnScreen[id]) marker.addTo(mapRef.current!);
    }
    // for every marker we've added previously, remove those that are no longer visible
    for (const id in markersOnScreen) {
      if (!newMarkers[id]) markersOnScreen[activeLayerId][id].remove();
    }

    console.log(`adding new markers for ${activeLayerId}: ${newMarkers.length}`);

    setMarkers(markers);
    setMarkersOnScreen({ ...markersOnScreen, [activeLayerId]: newMarkers });
  }, []);

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

      addSourceAndLayer(
        mapRef.current!,
        RootLayerIDs.NewLifers,
        nearbyObservationsToGeoJson({}),
        activeLayerId === RootLayerIDs.NewLifers ? "visible" : "none",
      );

      // after the GeoJSON data is loaded, update markers on the screen on every frame
      mapRef.current!.on("render", () => {
        if (!mapRef.current!.isSourceLoaded(activeLayerId)) return;
        updateMarkers(activeLayerId);
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
  }, [fileId]);

  useEffect(() => {
    if (!mapLoaded) return;

    allLayerIdRoots.forEach((rootLayerId) => {
      const layerIds = allSubLayerIds.map(
        (subLayerId) => `${rootLayerId}.${subLayerId}`,
      );
      layerIds.forEach((layerId) => {
        if (mapRef.current!.getLayer(layerId)) {
          const visibility = activeLayerId === rootLayerId ? "visible" : "none";
          mapRef.current!.setLayoutProperty(layerId, "visibility", visibility);
        }
      });
    });
  }, [activeLayerId, mapLoaded]);

  useEffect(() => {
    if (!mapLoaded) return;

    fetchNearbyObservations(
      debouncedCenter.lat,
      debouncedCenter.lng,
      fileId,
    ).then((data) => {
      const lifersSource = mapRef.current!.getSource(RootLayerIDs.NewLifers) as
        | GeoJSONSource
        | undefined;
      if (!lifersSource) return;
      lifersSource.setData({
        type: "FeatureCollection",
        features: nearbyObservationsToGeoJson(data),
      });
    });
  }, [debouncedCenter.lat, debouncedCenter, mapLoaded, fileId]);

  const handleClick = (e: { target: { id: string } }) => {
    setActiveLayerId(e.target.id as RootLayerIDs);
  };

  return (
    <div style={{ height: "100%", width: "100%", flexDirection: "row" }}>
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
      <div style={{ flexDirection: "column" }}>
        <LayerToggle
          id={RootLayerIDs.HistoricalLifers}
          label="Show historical lifers"
          checked={activeLayerId === RootLayerIDs.HistoricalLifers}
          onClick={handleClick}
        />
        <LayerToggle
          id={RootLayerIDs.NewLifers}
          label="Show new lifers. Note: you need be fairly zoomed in to see update these."
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
      <br />
      <div className="sidebar">
        Longitude: {center.lng.toFixed(4)} | Latitude: {center.lat.toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
    </div>
  );
}

function createCustomHTMLMarker(props: { species_codes: string }) {
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
  let width = 20;
  let height = 20;
  const backgroundColor = interpolateColors(
    "#fadd00",
    "#ff70ba",
    speciesCodes.length,
    1,
    250,
  );
  switch (classification) {
    case "small":
      width = 20;
      height = 20;
      break;
    case "medium":
      width = 50;
      height = 50;
      break;
    case "large":
      width = 100;
      height = 100;
      break;
  }

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

function interpolateColors(
  startColor: string,
  endColor: string,
  value: number,
  minValue: number,
  maxValue: number,
) {
  // Convert hex colors to RGB
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);

  // Calculate interpolation factor
  const t = (value - minValue) / (maxValue - minValue);

  // Interpolate RGB values
  const r = Math.round(startRGB.r + t * (endRGB.r - startRGB.r));
  const g = Math.round(startRGB.g + t * (endRGB.g - startRGB.g));
  const b = Math.round(startRGB.b + t * (endRGB.b - startRGB.b));

  // Return interpolated color as hex
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function App() {
  return (
    <>
      <BirdMap />
    </>
  );
}

export default App;
