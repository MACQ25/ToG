import { Component, input, Input, linkedSignal, model, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Set } from '../../../core/interfaces/set';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip-block',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './chip-block.component.html',
  styleUrl: './chip-block.component.scss',
})
export class ChipBlockComponent {
 
  ariaLabel = input.required<string>();
  cardTitle = input.required<string>();
  isPrimary = model<boolean>(true);
  showPanel = signal<boolean>(false);
  chipCollection = model<Set[]>();

}
