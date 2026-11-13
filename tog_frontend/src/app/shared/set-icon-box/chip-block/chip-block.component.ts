import { booleanAttribute, Component, input, Input, linkedSignal, model, output, signal } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Set } from '../../../core/interfaces/set';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip-block',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, CdkDropList, CdkDrag],
  templateUrl: './chip-block.component.html',
  styleUrl: './chip-block.component.scss',
})
export class ChipBlockComponent {
 
  ariaLabel = input.required<string>();
  cardTitle = input.required<string>();
  isPrimary = input<boolean>(true);
  isIEpool = input(false, { transform: booleanAttribute });
  showPanel = signal<boolean>(false);
  chipCollection = model<Set[]>();
  alternateList = model<Set[]>();
  showAll = signal<boolean>(false);
  dragging = signal<boolean>(false);
  chipMoved = output<any>();


  changePool(i: number){
    const addition: Set = this.chipCollection()?.splice(i, 1)[0]!
    this.alternateList.update(
      (val: Set[] | undefined) => {
         val?.push(addition); 
         return val
        }
      );
  }

  drop(event:any) {
    if (event.previousContainer === event.container) {
      this.chipCollection.update((set: any) => {
        moveItemInArray(set, event.previousIndex, event.currentIndex);
        return [...set];
      });
    } else {
      this.chipMoved.emit({
        fromId: event.previousContainer.id,
        toId: event.container.id,
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        set: event.item.data,
      });
    }
  }

}
