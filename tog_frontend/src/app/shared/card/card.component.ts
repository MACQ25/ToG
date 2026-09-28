import { Component, computed, ElementRef, inject, input, ViewChild } from '@angular/core';
import { card } from '../../core/interfaces/card';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  card = input.required<card>()
  type = computed(() => {
    switch(this.card()?.layout) {
      case 'transform':
        return 1;
      case 'modal_dfc':
        return 1;
      case 'reversible_card':
        return 1
      case 'adventure':
        return 2;
      case 'omen':
        return 2
      case 'split':
        return 3;
      case 'flip':
        return 4;
      case 'meld':
        return 5;
      case 'prepare':
        return 6
      default: return 0;
    }
  })
  url: string = '';

  state: boolean = true;
  oddIcon: string | undefined;
  
  @ViewChild('cardElem1') cardImg1!: ElementRef<HTMLImageElement>;
  @ViewChild('cardElem2') cardImg2?: ElementRef<HTMLImageElement>;
  @ViewChild('meldDiv') meldDiv?: ElementRef<HTMLDivElement>;
  @ViewChild('buttonElement') button?: ElementRef<HTMLImageElement>
  
  ngOnInit() {
    if(this.type() == 2) console.log(this.card())
    let cardName = this.card().name.replace(' // ', ' ').replaceAll(' ', '-');
    this.url = `https://scryfall.com/card/${this.card().set}/${this.card().number}/${cardName}`
  }

  applyAnimations(element: HTMLImageElement | HTMLDivElement, state: boolean, anim1: string, anim2: string, initial?: string){
    if (initial) element.classList.remove(initial);
    element.classList.remove(anim1, anim2);
    void element.offsetWidth;
    element.classList.add(state ? anim1 : anim2 );
  }

  change(){
    this.state = !this.state

    const el1 = this.cardImg1.nativeElement;
    let el2;

    switch(this.type()){
      case 1:
        el2 = this.cardImg2!.nativeElement;
        this.applyAnimations(el1, this.state, 'rotate-two-in', 'rotate-two-out')
        this.applyAnimations(el2, !this.state, 'rotate-two-in', 'rotate-two-out')
        break;
      case 2: 
        el2 = this.cardImg2!.nativeElement;
        el2.classList.remove('hidden')
        this.applyAnimations(el1, this.state, 'remove-portioned-a', 'show-portioned-a')
        this.applyAnimations(el2, !this.state, 'show-portioned-b', 'remove-portioned-b')
        break;
      case 3:
        this.applyAnimations(el1, this.state, 'rotate-flip-out', 'rotate-flip-in');
        break;
      case 4:
        this.applyAnimations(el1, this.state, 'flip-card-in', 'flip-card-out');
        break;
      case 5:
        let div: HTMLDivElement = this.meldDiv!.nativeElement
        this.applyAnimations(el1, this.state, 'full-meld', 'full-unmeld')
        div.classList.remove('hidden')
        this.applyAnimations((div!.children.item(0) as HTMLImageElement) , !this.state, 'front-top-f', 'front-top-b')
        this.applyAnimations((div!.children.item(1) as HTMLImageElement) , !this.state, 'back-top-f', 'back-top-b')
        this.applyAnimations((div!.children.item(2) as HTMLImageElement) , !this.state, 'front-bot-f', 'front-bot-b')
        this.applyAnimations((div!.children.item(3) as HTMLImageElement) , !this.state, 'back-bot-f', 'back-bot-b')
        this.applyAnimations((div!.children.item(4) as HTMLImageElement) , !this.state, 'full-meld', 'full-unmeld')        
        break;
      case 6: 
        el2 = this.cardImg2!.nativeElement;
        el2.classList.remove('hidden')
        this.applyAnimations(el1, this.state, 'remove-portioned-a', 'show-portioned-a')
        this.applyAnimations(el2, !this.state, 'show-portioned-c', 'remove-portioned-c')
        break;  
      default:
        console.log("huh?")
    }
  }

  iconType(){
    switch(this.type()){
      case 1:
        if (this.card().frameEffects?.find((elem) => elem == "originpwdfc")) {
          this.oddIcon = 'pw-icon'
        }
        return 'screen_rotation_alt'
      case 2:
        if (this.card().layout == 'adventure') return 'hiking'
        else if (this.card().layout === 'omen') return 'storm'
        else return 'question_mark'
      case 3:
        return 'turn_right'
      case 4:
        return 'autorenew'
      case 5:
        if (this.card().set === "EMN") {
          this.oddIcon = "eldritch"
          this.button?.nativeElement.offsetWidth;
        }
        return 'cell_merge'
      case 6:
        return 'book'
      default:
        return 'question_mark'
    }
  }
}
