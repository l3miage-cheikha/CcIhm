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
    this.couleurs.set(this.couleurs().map((c, i) => i === index ? color : c));
    this.couleursChangees.emit(this.couleurs());
  }

}
