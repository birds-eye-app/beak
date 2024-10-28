import { useRef, useEffect, useState } from 'react'
import mapboxgl, { GeoJSONSource, Map } from 'mapbox-gl'
import { Feature, Geometry, GeoJsonProperties } from "geojson";


import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

console.log(import.meta.env)

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

const INITIAL_CENTER = {
  lng: -74.0242,
  lat: 40.6941
}
const INITIAL_ZOOM = 10.12

import { useDebounce } from 'use-debounce';

enum RootLayerIDs {
  HistoricalLifers = 'historical_lifers',
  NewLifers = 'new_lifers'
}
enum SubLayerIDs {
  ClusterCircles = 'cluster_circles',
  ClusterCount = 'cluster_count',
  UnclusteredPoints = 'unclustered_points'
}


type Lifer = {
  common_name: string
  latitude: number
  longitude: number
  date: string
  taxonomic_order: number
  location: string
  location_id: string
}

type Location = {
  location_name: string
  latitude: number
  longitude: number
  location_id: string
}

type LocationToLifers = {
  location: Location
  lifers: Lifer[]
}

type LocationByLiferResponse = {
  [key: string]: LocationToLifers
}

function lifersToGeoJson(response: LocationByLiferResponse) {
  return Object.values(response).map((l) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          l.location.longitude,
          l.location.latitude
        ]
      },
      properties: {
        title: l.location.location_name,
        lifers: l.lifers,
        liferCount: l.lifers.length
      }
    } as Feature<Geometry, GeoJsonProperties>;
  })
}

function addSourceAndLayer(mapRef: Map, sourceId: RootLayerIDs, features: Feature<Geometry, GeoJsonProperties>[], visibility: 'visible' | 'none') {
  console.log(`Adding source and layer for ${sourceId}, visibility: ${visibility}`);
  mapRef.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: features,
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {
      sum: ["+",  ["get", "liferCount", ["properties"]]],
    },
  });

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.ClusterCircles}`,
    type: 'circle',
    source: sourceId,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    },
    layout: {
      visibility: visibility,
    }
  });

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.ClusterCount}`,
    type: 'symbol',
    source: sourceId,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'sum'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
      visibility: visibility,
    }
  });

  mapRef.addLayer({
    id: `${sourceId}.${SubLayerIDs.UnclusteredPoints}`,
    type: 'symbol',
    filter: ['!', ['has', 'point_count']],
    source: sourceId,
    layout: {
      'icon-image': 'custom-marker',
      'text-field': ['concat', ['get', 'liferCount'], ': ', ['get', 'title']],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.25],
      'text-size': 15,
      'text-anchor': 'top',
      'icon-size': 0.5,
      visibility: visibility,
    }
  });

  mapRef.on('click', `${sourceId}.${SubLayerIDs.UnclusteredPoints}`, (e) => {
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

    const html: string[] = []
    lifers.map((lifer: Lifer) => {
      html.push(`<div>${lifer.common_name} - ${lifer.date}</div>`)
    })


    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(html.join('\n'))
      .addTo(mapRef);
  });
}

 
function nearbyObservationsToGeoJson(lifers: LocationByLiferResponse): Feature<Geometry, GeoJsonProperties>[] {
  if (!lifers) return [];
  console.log('lifers:', lifers);
  return Object.values(lifers).flatMap((entry) => {
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            entry.location.longitude,
            entry.location.latitude,
          ]
        },
        properties: {
          title: entry.location.location_name,
          lifers: entry.lifers,
          liferCount: entry.lifers.length
        }
      }

      return feature as Feature<Geometry, GeoJsonProperties>;
  })
}

const LayerToggle = ({ id, label, checked, onClick }: { id: RootLayerIDs, label: string, checked: boolean, onClick: (e: { target: { id: string; }; }) => void }) => {
  return (
    <div className="sidebar-right">
    <label>
      <input type="radio" id={id}
        checked={checked}
        onChange={onClick} />
      {label}
    </label>
  </div>
  )
}

function BirdMap() {
  const mapRef = useRef<Map>()
  const mapContainerRef = useRef<HTMLElement>()

  const [center, setCenter] = useState(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const [debouncedCenter] = useDebounce(center, 500);


  const [activeLayerId, setActiveLayerId] = useState(RootLayerIDs.HistoricalLifers);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [fileId, setFileId] = useState('')

  useEffect(() => {
    if (fileId === '') return;
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM
    });

    mapRef.current!.on('load', () => {
      mapRef.current!.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          mapRef.current!.addImage('custom-marker', image!);

          fetchLifers(INITIAL_CENTER.lat, INITIAL_CENTER.lng, fileId).then((data) => {
            const lifersFeatures = lifersToGeoJson(data);
            addSourceAndLayer(mapRef.current!, RootLayerIDs.HistoricalLifers, lifersFeatures, activeLayerId === RootLayerIDs.HistoricalLifers ? 'visible' : 'none');
            
          })

          fetchNearbyObservations(INITIAL_CENTER.lat, INITIAL_CENTER.lng, fileId).then((data) => {
            addSourceAndLayer(mapRef.current!, RootLayerIDs.NewLifers, nearbyObservationsToGeoJson(data), activeLayerId === RootLayerIDs.NewLifers ? 'visible' : 'none');
          });
        })

      setMapLoaded(true)
    })

    // update map state on move so that we can use the lat/long values elsewhere (fetching data, etc)
    mapRef.current!.on('move', () => {
      const mapCenter = mapRef.current!.getCenter()
      const mapZoom = mapRef.current!.getZoom()

      // update state
      setCenter({ lng: mapCenter.lng, lat: mapCenter.lat })
      setZoom(mapZoom)
    })

    return () => {
      mapRef.current!.remove()
    }
  }, [fileId])

  useEffect(() => {
    if (!mapLoaded) return;

    const allLayerIdRoots = [RootLayerIDs.HistoricalLifers, RootLayerIDs.NewLifers];
    const subLayerIds = ['cluster_circles', 'cluster_count', 'unclustered_points'];

    allLayerIdRoots.forEach((rootLayerId) => {
      const layerIds = subLayerIds.map((subLayerId) => `${rootLayerId}.${subLayerId}`);
      layerIds.forEach((layerId) => {
        if (mapRef.current!.getLayer(layerId)) {
          const visibility = activeLayerId === rootLayerId ? 'visible' : 'none';
          mapRef.current!.setLayoutProperty(layerId, 'visibility', visibility);
        }
      });
    });
  }, [activeLayerId, mapLoaded]);


  useEffect(() => {
    if (!mapLoaded) return;

    fetchNearbyObservations(debouncedCenter.lat, debouncedCenter.lng, fileId).then((data) => {
      const lifersSource = mapRef.current!.getSource(RootLayerIDs.NewLifers) as GeoJSONSource | undefined;
      if (!lifersSource) return;
      lifersSource.setData(
        {
          type: 'FeatureCollection',
          features: nearbyObservationsToGeoJson(data),
        }
      )
    });

  }, [debouncedCenter.lat, debouncedCenter, mapLoaded, fileId])

  const handleClick = (e: { target: { id: string; }; }) => {
    setActiveLayerId(e.target.id as RootLayerIDs);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { key } = await uploadCsv(e.target.files[0]);
      setFileId(key);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', flexDirection: 'row' }}>
      <div style={{ flexDirection: 'column' }}>
        <div className="sidebar">
          Longitude: {center.lng.toFixed(4)} | Latitude: {center.lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}
        </div>
        <LayerToggle id={RootLayerIDs.HistoricalLifers} label='Show historical lifers' checked={activeLayerId ===RootLayerIDs.HistoricalLifers} onClick={handleClick} />
        <LayerToggle id={RootLayerIDs.NewLifers} label='Show new lifers' checked={activeLayerId ===RootLayerIDs.NewLifers} onClick={handleClick} />
        <input id="file" type="file" onChange={handleFileChange} />

      </div>
      <div
        id='map-container'
        // @ts-expect-error something something ref error
        ref={mapContainerRef!}
      />
    </div>
  )
}

const uploadCsv = async (file: File) => {
  console.log('Uploading file:', file);
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiBaseUrl}v1/upload_lifers_csv`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log('Upload response:', data);
  return data as { key: string };
}

// todo: dedupe
const fetchLifers = async (latitude: number, longitude: number, fileId: string) => {
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
    return data
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const fetchNearbyObservations = async (latitude: number, longitude: number, fileId: string) => {
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
    return data
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


function App() {
  return (
    <>
      <BirdMap />
    </>
  )
}

export default App