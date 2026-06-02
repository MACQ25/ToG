import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-set-select',
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './set-select.component.html',
  styleUrl: './set-select.component.css'
})
export class SetSelectComponent {

  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private http = inject(HttpClient);

  title = 'tog_project';
  selected = 'option2';
  list: {value: string, text: string, icon: string }[] = [];

  constructor(){
    this.iconRegistry.addSvgIconSet(
      this.sanitizer.bypassSecurityTrustResourceUrl('https://svgs.scryfall.io')
    );
    this.operation()
  }

  async operation() {
    // Fetch a card
    const response = await fetch("http://localhost:3000/api/bsets")
    const data = await response.json()
    
    this.list = data.map((set:any) => {
      
      let code: string = set.data.code.toLowerCase()

      this.iconRegistry.addSvgIcon(
        `${code}-icon`,
        this.sanitizer.bypassSecurityTrustResourceUrl(`https://svgs.scryfall.io/sets/${code}.svg`)
      );

      //console.log(`https://svgs.scryfall.io/sets/${code.toLowerCase()}.svg`)

      return {
        value: set._id,
        text: set.data.name,
        icon: `${code}-icon`
        }
      }
    )

    console.log(this.list)
  }

}
