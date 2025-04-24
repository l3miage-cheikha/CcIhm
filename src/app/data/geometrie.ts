import { Feature, MultiPolygon, Polygon, Position } from "geojson";
import { Icon, icon, LatLngExpression, LatLngTuple, Layer, marker, Marker, polygon } from "leaflet"

/**
 * Crée un marqueur Leaflet à partir de coordonnées géographiques.
 */
export function getLeafletMarkerFromCoords([lat, lon]: LatLngTuple): Marker {
    return marker([ lat, lon ], {
        icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
       })
    });
}

/**
 * Crée une couche Leaflet représentant un polygone à partir d'un objet GeoJSON.
 */
export function getLayerFromGeoJSON(geojson: Feature<Polygon> | Feature<MultiPolygon>, color?: string): Layer {
    return polygon(
        geojson.geometry.type === 'Polygon' ? geojson.geometry.coordinates.map(L => L.map(PositionToLatLng))
                                            : geojson.geometry.coordinates.map(P => P.map(L => L.map(PositionToLatLng))),
        {
            color
        }                                            
    );
}

/**
 * Fonction utilitaire utilisée par getLayerFromGeoJSON
 * Les coordonnées geoJSON sont [lon, lat] alors que les coordonnées Leaflet sont [lat, lon].
 */
function PositionToLatLng(pos: Position): LatLngExpression {
    return [ pos[1], pos[0] ];
}
