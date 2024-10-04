import { useRef, useEffect, useState } from 'react'
import mapboxgl, { LngLatLike, Map } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

const TOKEN = 'pk.eyJ1IjoiZGF2aWR0bWVhZG93cyIsImEiOiJjbTF0djNteTgwNzYzMnFvbGJrdjU3YzMzIn0.3sZJbLI9SKeK4Zs2ZFsuaA'

const INITIAL_CENTER = [
  -74.0242,
  40.6941
]
const INITIAL_ZOOM = 10.12

type lifer = {
  common_name: string;
  latitude: number;
  longitude: number;
  date: string
  taxonomic_order: string;
}

import lifers from './lifers.json';

function lifersToGeoJson() {
  return lifers.map((lifer) => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          lifer.longitude,
          lifer.latitude
        ]
      },
      properties: {
        title: lifer.common_name
      }
    }
  })
}

console.log(lifersToGeoJson()[0])

function App() {
  const mapRef = useRef<Map>()
  const mapContainerRef = useRef<HTMLElement>()

  const [center, setCenter] = useState<LngLatLike>(INITIAL_CENTER)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)

  const [activeLayerIds, setActiveLayerIds] = useState(['historical_lifers']);
  const [mapLoaded, setMapLoaded] = useState(false);


  useEffect(() => {
    mapboxgl.accessToken = TOKEN
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: center,
      zoom: zoom
    });

    mapRef.current!.on('load', () => {
      mapRef.current!.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          mapRef.current!.addImage('custom-marker', image!);

          mapRef.current!.addSource('historical_lifers', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: lifersToGeoJson(),
            }
          });

          mapRef.current!.addLayer({
            id: 'historical_lifers',
            type: 'symbol',
            source: 'historical_lifers',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'title'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
              'text-variable-anchor': ['top', 'bottom'],
              visibility: 'visible',
            }
          });
        })

        setMapLoaded(true)
    })

    mapRef.current!.on('move', () => {
      // get the current center coordinates and zoom level from the map
      const mapCenter = mapRef.current!.getCenter()
      const mapZoom = mapRef.current!.getZoom()

      // update state
      setCenter([mapCenter.lng, mapCenter.lat])
      setZoom(mapZoom)
    })

    mapRef.current!.on('idle', () => {
      if (
        !mapRef.current!.getLayer('museums')
      ) {
        return;
      }
    });

    return () => {
      mapRef.current!.remove()
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded) return;

    const allLayerIds = ['historical_lifers'];

    // for each layerId, check whether it is included in activeLayerIds,
    // show and hide accordingly by setting layer visibility
    allLayerIds.forEach((layerId) => {
      if (activeLayerIds.includes(layerId)) {
        mapRef.current!.setLayoutProperty(layerId, 'visibility', 'visible');
      } else {
        mapRef.current!.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
  }, [activeLayerIds]);

  const handleClick = (e) => {
    const layerId = e.target.id;

    if (activeLayerIds.includes(layerId)) {
      setActiveLayerIds(activeLayerIds.filter((d) => d !== layerId));
    } else {
      setActiveLayerIds([...activeLayerIds, layerId]);
    }
  };

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <div className="sidebar-right">
        <label>
          <input type="checkbox" id='historical_lifers'
            checked={activeLayerIds.includes('historical_lifers')}
            onChange={handleClick} />
          Show Historical Lifers
        </label>
      </div>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}

export default App