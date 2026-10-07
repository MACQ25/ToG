import { Component, viewChild } from '@angular/core';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-frontpage',
  imports: [MatExpansionModule, MatDividerModule, MatButtonModule, MatIconModule],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.scss',
})
export class FrontpageComponent {
    accordion = viewChild.required(MatAccordion);
}
