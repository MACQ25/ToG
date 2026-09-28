import { computed, Injectable, signal } from '@angular/core';
import { SetsService } from './sets.service';
import { Set } from '../../interfaces/set';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetSelectService {
  
  selected = signal<Set|null|undefined>(null)
  list = signal<Set[]>([]);

  setData = computed((): Set | undefined => {
    return this.selected() ? this.list().find((elem) => elem.id === this.selected()?.id) : undefined
  })
  
  constructor(private setService: SetsService){
    this.setService.listSets().subscribe(
      {
        next: res => { 
          this.list.update(sets => res)
        },
        error: res => {} //console.error(res)
      }
    )
  }

}
