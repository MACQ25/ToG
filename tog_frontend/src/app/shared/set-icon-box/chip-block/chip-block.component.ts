import { booleanAttribute, Component, computed, input, Input, linkedSignal, model, output, signal } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDragStart, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Set } from '../../../core/interfaces/set';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { switchChip, dragChip } from '../switchChip';


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
  collectionId = input<string>('');
  isIEpool = input(false, { transform: booleanAttribute });
  
  isPrimary = input<boolean>(true);
  showPanel = signal<boolean>(false);
  showAll = signal<boolean>(false);
  dragging = signal<boolean>(false);

  chipMoved = output<any>();

  chipCollection = model<any>();
  collectionDisplay = computed(() => {
     return (this.collectionId() ? this.chipCollection()[this.collectionId()] : this.chipCollection())
  })

  changePool(i: number){
    this.chipMoved.emit({
      fromId: this.collectionId(),
      previousIndex: i,
    });
  }

  drop(event:any) {
    if (event.previousContainer === event.container) {
      this.chipCollection.update((coll: any) => {
        moveItemInArray(coll[this.collectionId()], event.previousIndex, event.currentIndex);
        return coll;
      });
    } else {
      this.chipMoved.emit({
        fromId: event.previousContainer.id,
        toId: event.container.id,
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        data: event.item.data,
      });
    }
  }

}
