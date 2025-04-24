import { Injectable, signal } from '@angular/core';
import { getDepartementCodesFromRegion, getGeometrieCommune, getGeometrieDepartement, getLatLngCentre, getLatLngMairie, searchCommune, searchDepartement, searchRegion } from './api.gouv';
import { CommuneCarto, DataCarto, DepartementCarto, RegionCarto } from '../data/data.carto';
import { Commune, CommuneSchema } from '../data/commune';
import { mock } from '../data/mock.data';
import { Departement, DepartementsSchema } from '../data/departement';
import { RegionSchema } from '../data/region';

@Injectable({
  providedIn: 'root'
})
export class CartoService {
  private readonly _data = signal<DataCarto | undefined>( mock );
  public readonly data = this._data.asReadonly();

  private readonly _colors = signal<readonly string[]>(
    (this.data()?.region.departements ?? []).map( () => '#008000' )
  );
  public readonly colors = this._colors.asReadonly();

  /**
   * Permet de mettre à jour les couleurs associées aux départements
   */
  updateColors(colors: readonly string[]): void {
    const C = [...colors];
    this._colors.set(C);
  }

  /**
   * Récupère la commune correspondante aux coordonnées géographiques passées en paramètre.
   * (utiliser searchCommune)
   * Si une commune est trouvée, il récupère :
   *   - le contour, le centre et la position de la mairie de la commune,
   *     (utiliser getGeometrieCommune, getLatLngCentre, getLatLngMairie, )
   *   - la région correspondante à la commune
   *     (utiliser searchRegion)
   *   - les départements de cette région
   *     (utiliser getDepartementCodesFromRegion)
   *   - les contours de ces départements
   *     (utiliser getGeometrieDepartement)
   *
   * Ces données servent à construire un objet de type DataCarto.
   * Cet objet de type DataCarto est ensuite stocké dans le signal `data`.
   *
   * Ces données permettent également de mettre à jour le tableau de couleurs
   * associé aux départements de la région (signal _colors).
   * Par défaut, la couleur d'un département est bleue (`#0000FF`).
   *
   * Si aucune commune n'est trouvée, ou si une erreur survient,
   *   - le signal `data` est mis à `undefined`,
   *   - le signal _colors est mis à `[]`
   *   - la promesse est rejetée avec le message "Aucune commune trouvée".
   *     (utiliser Promise.reject("Aucune commune trouvée"))
   */
  // Appuyez vous sur les fonctions (à l'extérieur de la classe) définies dans `geometrie.ts` et `api.gouv.ts`: `searchCommune`,
  // `getGeometrieCommune`, `searchRegion`, `getDepartementCodesFromRegion`, `getGeometrieDepartement`, `getLatLngCentre`, `getLatLngMairie`
  async updateDataFromCoord(lat: number, lon: number): Promise<void> {
    try {
      const commune = await searchCommune(lat, lon);

      if (commune === undefined) {
        this.handleError();
      }

      const communeCarto = await this.getCommuneCarto(commune);
      const regionCarto = await this.getRegionCarto(commune);

      const dataCarto: DataCarto = {
        commune: communeCarto,
        region: regionCarto
      };

      this._data.set(dataCarto);

      // mis à jour des couleurs définies par l'utilisateur
      // à faire
    } catch(error) {
      this.handleError();
    }
  }

  private handleError(): Promise<void> {
    this._data.set(undefined);
    this._colors.set([]);
    return Promise.reject("Aucune commande trouvée");
  }

  private async getCommuneCarto(commune: Commune): Promise<CommuneCarto> {
    const contour = await getGeometrieCommune(commune);
    const centre = await getLatLngCentre(commune);
    const position = await getLatLngMairie(commune);

    const communeCarto: CommuneCarto = {
      data: commune,
      geometry: contour,
      mairie: position,
      centre: centre
    };

    return Promise.resolve(communeCarto);
  }

  private async getRegionCarto(commune: Commune): Promise<RegionCarto> {
    const region = await searchRegion(commune.codeRegion);

    const departements = await getDepartementCodesFromRegion(region);

    const departementsCartos: readonly DepartementCarto[] = await Promise.all(departements.map(this.getDepartementCarto));

    const regionCarto: RegionCarto = {
      data: region,
      departements: departementsCartos
    };

    return Promise.resolve(regionCarto);
  }

  private async getDepartementCarto(departement: Departement): Promise<DepartementCarto> {
    const geometry = await getGeometrieDepartement(departement);

    const departementCarto: DepartementCarto = {
      data: departement,
      geometry: geometry
    };

    return Promise.resolve(departementCarto);
  }

}
