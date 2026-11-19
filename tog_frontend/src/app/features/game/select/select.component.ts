import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  standalone: false,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {

  constructor(private router: Router){}

  get inMain(){ return this.router.url === '/play/enter'; }

}
