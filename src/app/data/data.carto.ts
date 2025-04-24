import { Feature, Polygon, MultiPolygon } from "geojson";
import { Commune } from "./commune";
import { Departement } from "./departement";
import { Region } from "./region";
import { LatLngTuple } from "leaflet";

/**
 * Représente un département avec en plus
 *   - sa géométrie (son contour).
 */
export interface DepartementCarto {
    data: Departement;
    geometry: Feature<Polygon> | Feature<MultiPolygon>;
}

/**
 * Représente une commune avec eb plus
 *   - sa géométrie (son contour)
 *   - les coordonnées de sa mairie
 *   - les coordonnées de son centre
 */
export interface CommuneCarto {
    readonly data: Commune;
    readonly geometry: Feature<Polygon> | Feature<MultiPolygon>;
    readonly mairie: LatLngTuple;
    readonly centre: LatLngTuple;
}

/**
 * Représente une région avec en plus
 *   - les départements qui la composent
 */
export interface RegionCarto {
    readonly data: Region;
    readonly departements: readonly DepartementCarto[];
}

/**
 * Représente les données cartographiques d'une commune
 * ainsi que de sa région.
 */
export interface DataCarto {
    readonly commune: CommuneCarto;
    readonly region: RegionCarto;
}
