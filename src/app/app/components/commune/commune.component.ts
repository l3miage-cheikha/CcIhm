import { Component, computed, effect, input, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, LatLng, LatLngTuple, Layer, Marker, tileLayer } from 'leaflet';
import { getLayerFromGeoJSON, getLeafletMarkerFromCoords } from '../../data/geometrie';
import { CommuneCarto } from '../../data/data.carto';

/**
 * Interface Typescript représentant les données
 * utiles liées à la carte d'une commune.
 */
interface CommuneState extends CommuneCarto {
  readonly layers: Layer[]; // Le tableau doit être mutable d'après la spécification de la bibliothèque ngx-leaflet
  readonly options: {
    readonly zoom: 10;
    readonly minZoom: 10;
    readonly maxZoom: 10;
    readonly zoomControl: false;
    readonly attributionControl: false;
    readonly dragging: false;
    readonly center: LatLngTuple;
  }
}

@Component({
  selector: 'app-commune',
  imports: [
    LeafletModule
  ],
  templateUrl: './commune.component.html',
  styleUrl: './commune.component.scss'
})
export class CommuneComponent {
  private readonly baseLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' });
  communeCarto = input.required<CommuneCarto>()
  couleur = input<string>("#FF0000")


  private _marker = computed<Marker>(() => getLeafletMarkerFromCoords([this.communeCarto().mairie[0], this.communeCarto().mairie[1]]))
  /*Dérivez un signal private nommé _contour et produisant des données de type Layer. Le contour doit être celui de la commune et de la couleur
  spécifiée par le composant. (voir la fonction getLayerFromGeoJSON de geometrie.ts).*/
  private _contour = computed<Layer>(() => getLayerFromGeoJSON(this.communeCarto().geometry, this.couleur()))
   
  protected state = computed<CommuneState>(
    () => (
      {
        ...this.communeCarto(),
        /*Le tableau layers doit contenir dans l'ordre : le fond de carte (voir l'attribut baseLayer), le contour de la commune et le marqueur de la mairie.*/
        layers: [
          this.baseLayer,
          this._contour(),
          this._marker(),

        ],
        options: {
          zoom: 10,
          minZoom: 10,
          maxZoom: 10,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          center: this.communeCarto().centre
        }
      }
)
  )
 center =computed<LatLng>( ()=>latLng(this.state().options.center))
  // Le tableau doit être mutable d'après la spécification de la bibliothèque ngx-leaflet



}
