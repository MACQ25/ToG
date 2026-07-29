import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-return-button',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './game-return-button.component.html',
  styleUrl: './game-return-button.component.scss',
})
export class GameReturnButtonComponent {

}
