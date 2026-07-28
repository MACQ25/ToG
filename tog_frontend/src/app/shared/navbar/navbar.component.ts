import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/baseServices/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  status: boolean = false
  logoutF: any

  constructor(private auth: AuthService){}

  ngOnInit(){
    this.auth.currentUser$.subscribe(state => {
      if (state){
        this.status = true
        this.logoutF = ():void => this.auth.logout();
      } else this.status = false;
    })
  }

}
