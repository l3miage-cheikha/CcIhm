import { Feature, MultiPolygon, Point, Polygon } from "geojson";
import { Commune } from "../data/commune";
import { Departement } from "../data/departement";
import { Region } from "../data/region";
import { latLng, LatLng, LatLngTuple } from "leaflet";

const baseURL = "https://geo.api.gouv.fr";

/**
 * Réalise une recherche de commune à partir de coordonnées géographiques.
 */
export function searchCommune(lat: number, lon: number): Promise<Commune> {
    return fetch(`${baseURL}/communes?lat=${lat}&lon=${lon}`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de recherche de commune: ${res.status} ${res.statusText}`) )
    ).then(
        (L: readonly Commune[]) => L.length > 0 ? L[0] : Promise.reject( new Error("Aucune commune trouvée") )
    )
}

/**
 * Réalise une recherche de département à partir de son code.
 */
export function searchDepartement(codeDepartement: string): Promise<Departement> {
    return fetch(`${baseURL}/departements/${codeDepartement}`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de recherche du département "${codeDepartement}": ${res.status} ${res.statusText}`) )
    )
}

/**
 * Réalise une recherche de région à partir de son code.
 */
export function searchRegion(codeRegion: string): Promise<Region> {
    return fetch(`${baseURL}/regions/${codeRegion}`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de recherche de la région "${codeRegion}": ${res.status} ${res.statusText}`) )
    )
}

/**
 * Récupère la liste des départements d'une région donnée.
 */
export function getDepartementCodesFromRegion(region: Region): Promise<readonly Departement[]> {
    return fetch(`${baseURL}/regions/${region.code}/departements`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de recherche des départements de la région "${region.code}": ${res.status} ${res.statusText}`) )
    ).then(
        L => L.map( (d: Pick<Departement, 'nom' | 'code'>) => ({...d, codeRegion: region.code}) )
    )
}

/**
 * Récupère la géométrie d'un département donné, au format GeoJSON Feature<Polygon> | Feature<MultiPolygon>.
 */
export function getGeometrieDepartement(d: Departement): Promise<Feature<Polygon> | Feature<MultiPolygon>> {
    const base = "https://raw.githubusercontent.com/gregoiredavid/france-geojson/refs/heads/master/departements";
    
    const num = d.code.toUpperCase();
    const name = d.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s']/g, '-');
    const slugStr = `${num}-${name}`;

    return fetch(`${base}/${slugStr}/departement-${slugStr}.geojson`).then(
        res => res.status >= 200 && res.status < 400 ? res.json() : Promise.reject( new Error(`Erreur de récupération de la géométrie du département "${d.code}": ${res.status} ${res.statusText}`) )
    )

}


export function getGeometrieCommune(c: Commune): Promise<Feature<Polygon> | Feature<MultiPolygon>> {
    return fetch(`${baseURL}/communes/${c.code}?format=geojson&geometry=contour`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de récupération de la géométrie de la commune "${c.code}": ${res.status} ${res.statusText}`) )
    )
}

export function getLatLngMairie(c: Commune): Promise<LatLngTuple> {
    return fetch(`${baseURL}/communes/${c.code}?format=geojson&geometry=mairie`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de récupération des coordonnées de la mairie de la commune "${c.code}": ${res.status} ${res.statusText}`) )
    ).then(
        (f: Feature<Point>) => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
        ]
    )
}

export function getLatLngCentre(c: Commune): Promise<LatLngTuple> {
    return fetch(`${baseURL}/communes/${c.code}?format=geojson&geometry=centre`).then(
        res => res.status === 200 ? res.json() : Promise.reject( new Error(`Erreur de récupération des coordonnées du centre de la commune "${c.code}": ${res.status} ${res.statusText}`) )
    ).then(
        (f: Feature<Point>) => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
        ]
    )
}
