import { effect, Injectable, signal } from '@angular/core';
import { SetsService } from './sets.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  cards = signal<any[]>([])

  constructor(private setService: SetsService){}

  public fetchSetGallery(code: String){
    this.setService.setCardList(code).subscribe({
      next: res => {
        console.log(res)
        this.cards.set(res)
        console.log(this.cards())
      },
      error: res => console.log(res)
    })
  }

}
