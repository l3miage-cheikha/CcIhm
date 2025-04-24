import { Component, computed, inject, signal } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, Layer, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';
import { CartoService } from './services/carto.service';
import { getLayerFromGeoJSON } from './data/geometrie';
import { CommuneComponent } from './components/commune/commune.component';
import { RegionComponent } from './components/region/region.component';
import { DepartementCarto, RegionCarto } from './data/data.carto';
import { Departement } from './data/departement';

@Component({
  selector: 'app-root',
  imports: [
    LeafletModule,
    CommuneComponent,
    RegionComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  // Ne pas modifier *
  service = inject(CartoService);
  data = this.service.data

  protected readonly color = signal<string>("#0000FF");
  protected readonly colors = signal<readonly string[]>(
    this.data()?.region.departements.map(_ => "#0000FF") as string[]
  );

  protected readonly options: MapOptions = {
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
    center: latLng(47, 2.5)
  };

  // Ne pas modifier errorMsg (mais vous pouvez/devez l'utiliser, voir question D)
  private readonly _errorMsg = signal<string | undefined>(undefined);
  protected readonly errorMsg = this._errorMsg.asReadonly();

  /**
   * Réponses aux questions à placer ci-dessous
   */
  private readonly baseLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' });
  protected readonly allLayers = computed<Layer[]>(() => {
  const base = this.baseLayer;
  const region = this.data()?.region;
  const couleurs = this.colors();

  if (!region) return [base];

  const departementLayers = region.departements.map((dep, i) =>
    getLayerFromGeoJSON(dep.geometry, couleurs[i])
  );

  return [base, ...departementLayers];
});


  // Méthode pour gérer la mise à jour des couleurs
  onColorsChanged(newColors: readonly string[]) {
    this.colors.set(newColors);
  }
  //################
  protected readonly onClick = async (event: LeafletMouseEvent) => {
    try {
      this._errorMsg.set(undefined); // reset erreur

      await this.service.updateDataFromCoord(event.latlng.lat, event.latlng.lng);
    } catch (e) {
      this._errorMsg.set("Aucune commune trouvée");
    }
  }

}
