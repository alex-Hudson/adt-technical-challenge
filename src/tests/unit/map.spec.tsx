import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Map } from '../../map';
import { RampData, RampProperties } from '../../types';
import maplibregl from 'maplibre-gl';

jest.mock('maplibre-gl/dist/maplibre-gl.css', () => '')

jest.mock('maplibre-gl',() => ({}))

jest.mock('react-map-gl', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div data-testid="ReactMap">{children}</div>),
  Marker: jest.fn(({ latitude, longitude, onClick }) => (
    <div
      data-testid="Marker"
      data-latitude={latitude}
      data-longitude={longitude}
      onClick={onClick}
    />
  )),
  Popup: jest.fn(({ latitude, longitude, children }) => (
    <div
      data-testid="Popup"
      data-latitude={latitude}
      data-longitude={longitude}
    >
      {children}
    </div>
  )),
}));

const sampleRamps: RampData = {
  features: [
    {
      id: '1',
      geometry: {
        coordinates: [[[[-73.935242, 40.73061]]]], // Example coordinates (longitude, latitude)
      },
      properties: {
        material: 'Wood',
      },
    },
    {
      id: '2',
      geometry: {
        coordinates: [[[[-74.935242, 41.73061]]]], // Example coordinates (longitude, latitude)
      },
      properties: {
        material: 'Steel',
      },
    },
  ],
};

describe('Map Component', () => {
  let setVisibleFeaturesMock;

  beforeEach(() => {
    setVisibleFeaturesMock = jest.fn();
  });

  test('renders without crashing', () => {
    render(
      <Map ramps={sampleRamps} visibleFeatures={[]} setVisibleFeatures={setVisibleFeaturesMock} />
    );
    expect(screen.getByTestId('ReactMap')).toBeInTheDocument();
  });

  test('renders markers for each feature', () => {
    render(
      <Map ramps={sampleRamps} visibleFeatures={[]} setVisibleFeatures={setVisibleFeaturesMock} />
    );
    const markers = screen.getAllByTestId('Marker');
    expect(markers).toHaveLength(sampleRamps.features.length);

    markers.forEach((marker, index) => {
      expect(marker).toHaveAttribute('data-latitude', sampleRamps.features[index].geometry.coordinates[0][0][0][1].toString());
      expect(marker).toHaveAttribute('data-longitude', sampleRamps.features[index].geometry.coordinates[0][0][0][0].toString());
    });
  });

  test('shows popup on marker click', () => {
    render(
      <Map ramps={sampleRamps} visibleFeatures={[]} setVisibleFeatures={setVisibleFeaturesMock} />
    );

    const marker = screen.getAllByTestId('Marker')[0];
    fireEvent.click(marker);

    const popup = screen.getByTestId('Popup');
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveAttribute('data-latitude', sampleRamps.features[0].geometry.coordinates[0][0][0][1].toString());
    expect(popup).toHaveAttribute('data-longitude', sampleRamps.features[0].geometry.coordinates[0][0][0][0].toString());
    expect(popup).toHaveTextContent(JSON.stringify(sampleRamps.features[0]));
  });

  test('renders all child components correctly', () => {
    render(
      <Map ramps={sampleRamps} visibleFeatures={[]} setVisibleFeatures={setVisibleFeaturesMock} />
    );

    expect(screen.getByTestId('ReactMap')).toBeInTheDocument();
    expect(screen.getAllByTestId('Marker')).toHaveLength(sampleRamps.features.length);
  });
});