import { computed, Injectable, signal } from '@angular/core';
import { SetsService } from './sets.service';
import { Set } from '../../interfaces/set';

@Injectable({
  providedIn: 'root',
})
export class SetSelectService {
  
  options = signal<object[]>([])
  selected = signal<string|null>(null)
  list: Set[] = [];
  
  displayName = computed(() =>
    this.selected()
      ? (`${this.list.find((elem) => elem.id === this.selected())?.name ?? "none"} ` )
      : "none"
  );

  displayIcon = computed(() =>
    this.selected()
      ? (this.list.find((elem) => elem.id === this.selected())?.icon)
      : ""
  );

  setCode = computed(() => 
    this.selected() 
      ? (this.list.find((elem) => elem.id === this.selected())?.code)
      : "" 
  )

  constructor(private setService: SetsService){
    this.setService.listSets().subscribe(
      {
        next: res => { 
          this.list = res
        },
        error: res => {} //console.error(res)
      }
    )
  }

}
