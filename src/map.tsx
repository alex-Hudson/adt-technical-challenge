import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/map.css";

import { Feature, MultiPolygon } from "geojson";
import { RampData, RampProperties } from "./types";
import React, { Dispatch, SetStateAction, useState, useEffect, useRef, useMemo, useCallback } from "react";
import ReactMap, { Marker, Popup, ViewStateChangeEvent } from "react-map-gl";

import maplibregl from "maplibre-gl";

export const Map = ({
  ramps,
  visibleFeatures,
  setVisibleFeatures,
}: {
  ramps: RampData;
  visibleFeatures: Feature<MultiPolygon, RampProperties>[] | [];
  setVisibleFeatures: Dispatch<
    SetStateAction<Feature<MultiPolygon, RampProperties>[] | []>
  >;
}) => {
  if (!visibleFeatures) {
    visibleFeatures = ramps.features;
  }
  const [popupData, setPopupData] = useState<
    Feature<MultiPolygon, RampProperties> | undefined
  >(undefined);

  const features: JSX.Element[] = [];

  for (const feature of ramps.features) {
    features.push(
      <Marker
        key={feature.id}
        latitude={feature.geometry.coordinates[0][0][0][1]}
        longitude={feature.geometry.coordinates[0][0][0][0]}
        onClick={() => {
          setPopupData(feature);
        }}
      />
    );
  }

  // Use map layer to search within bounds
  const filterVisibleRamps = (evt: ViewStateChangeEvent) => {
    const bounds = evt.target.getBounds();
    const visibleRamps = ramps.features.filter(
      ({ geometry: { coordinates } }) => {
        let inBounds = true;
        coordinates[0][0].map((coordKvPair) => {
          if (!bounds.contains(coordKvPair as [number, number])) {
            inBounds = false;
          }
        });
        return inBounds;
      }
    );
    setVisibleFeatures(visibleRamps);
  };

  const initialState = {
    latitude: ramps.features[0].geometry.coordinates[0][0][0][1],
    longitude: ramps.features[0].geometry.coordinates[0][0][0][0],
    zoom: 8,
  };

  // Popup only displays once and never again
  return (
    <ReactMap
      mapLib={maplibregl}
      initialViewState={initialState}
      style={{ width: "100%", height: "100%" }}
      // Style and key borrowed from https://www.maptiler.com/maps/#basic//vector/1/0/0
      mapStyle="https://api.maptiler.com/maps/streets/style.json?key=eIgS48TpQ70m77qKYrsx"
      onMove={filterVisibleRamps}
    >
      {features}
      {popupData && (
        <Popup
          latitude={popupData.geometry.coordinates[0][0][0][1]}
          longitude={popupData.geometry.coordinates[0][0][0][0]}
          closeOnClick={false}
        >
          {JSON.stringify(popupData)}
        </Popup>
      )}
    </ReactMap>
  );
};
