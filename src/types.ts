import { FeatureCollection, MultiPolygon } from "geojson";

export type RampProperties = {
    rec_id: number;
    asset_numb: string;
    material: string;
    area_: number;
    update_dat: string;
    owner: string;
    condition: number;
};

export type RampData = FeatureCollection<MultiPolygon, RampProperties>;

export type ChartDatum = { id: string; value: number };