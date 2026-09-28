import { computed, effect, Injectable, signal } from '@angular/core';
import { SetsService } from './sets.service';
import { card } from '../../interfaces/card';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  
  cardsBase = signal<card[]>([]);
  treatmentCategories = signal<any>([])
  collectionFilter = signal<any>('');
  cardsFiltered = computed(() => {
    let filter = this.collectionFilter();
    if (filter === '' || filter === 'none' || !filter) return this.cardsBase();
    else {
      let filtered= this.cardsBase().filter((card) => card.inner_category == filter)
      console.log(filtered)
      return filtered
    }
  })


  constructor(private setService: SetsService){
  }

  public fetchSetGallery(code: String){
    this.setService.setCardList(code).subscribe({
      next: res => {
        this.cardsBase.set(res.cards);
        this.treatmentCategories.set(res.categories)
      },
      error: res => console.log(res)
    })
  }

}
