import { Component, EventEmitter, input, model, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionCarto } from '../../data/data.carto';

@Component({
  selector: 'app-region',
  imports: [
    FormsModule
  ],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss'
})
export class RegionComponent {
  readonly regionCarto = input.required<RegionCarto>();
  couleurs = model<readonly string[]>([]);
  couleursChangees = output<readonly string[]>(); // Émetteur d'événements correctement défini
  readonly couleurUtilisateur = signal<string>("#0000FF");

  update(color: string, index: number) {
    console.log(`Tentative de mise à jour de la couleur à l'index ${index} avec la couleur ${color}`);
    console.log('Couleurs actuelles:', this.couleurs());
    
    // Créer un tout nouveau tableau pour forcer la détection de changement
    const newCouleurs = Array.from(this.couleurs());
    newCouleurs[index] = color;
    
    console.log('Nouvelles couleurs:', newCouleurs);
    
    // Utiliser update sur le model pour garantir la mise à jour
    this.couleurs.update(() => newCouleurs);
    
    // Émettre l'événement séparément
    this.couleursChangees.emit(newCouleurs);
  }
}