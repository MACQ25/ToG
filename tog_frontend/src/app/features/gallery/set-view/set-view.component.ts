import { Component, effect, signal } from '@angular/core';
import { SetSelectComponent } from '../../../shared/set-select/set-select.component';
import { SetSelectService } from '../../../core/services/cardServices/set-select.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CardsService } from '../../../core/services/cardServices/cards.service';

@Component({
  selector: 'app-set-view',
  standalone: false,
  templateUrl: './set-view.component.html',
  styleUrl: './set-view.component.scss',
})
export class SetViewComponent {
  
  constructor(public selectServ: SetSelectService, public cardsServ: CardsService){
      effect(() => {
        let code = this.selectServ.setData()?.code
        if (code) {
          this.cardsServ.fetchSetGallery(code);
        } else{
           this.cardsServ.cardsBase.set([]);
           this.cardsServ.collectionFilter.set('');
          }
      }
    )
  }

}
