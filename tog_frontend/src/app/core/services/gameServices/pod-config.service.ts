import { Injectable } from '@angular/core';

export interface verboseOption {
    value: null | number 
    name: string
    desc?: string
}

@Injectable({
  providedIn: 'root',
})
export class PodConfigService {
 
    readonly modes: verboseOption[] = [
      {value: null, name: "Select a format" },
      {value: 1, name: "Progression" },
      {value: 2, name: "league" },
      {value: 3, name: "Constructed"},
      {value: 4, name: "Custom"},
    ]
    
    readonly progression: verboseOption[] = [
      { value: null, name: "Pick one", desc: "" },
      { value: 1, name: "old school 93-94", desc: "Start a pod like you are one of the first few to get a hold of alpha and beta, era of moxes and 'the deck'"},
      { value: 2, name: "PT", desc: "Start progression with the pool of sets featured at the first pro-tour, 4th edition onwards!"},
      { value: 3, name: "1999", desc: "The game as it was after Urza block, the later half of premodern, starting at 6th Edition"},
      { value: 4, name: "Modern", desc: "The unveiling of a new frame, the starting point of one of magic's most beloved formats"},
      { value: 5, name: "Specific set", desc: "Alright, got nostalgia for a specific set you started with? put it here and run the pod that way"}, 
    ]

    readonly constructed: verboseOption[] = [
      { value: null, name: "Pick one" , desc: "" },
      { value: 3, name: "T2" , desc: "Flashback to a standard of years past" },
      { value: 4, name: "Block Constructed" , desc: "Constructed format limited to the pool of blocks of days past" },
    ]

    readonly t2 = [
      { value: 2, name: "Planar Standard" },
      { value: 3, name: "Long Standard" },
      { value: 4, name: "Extended Sunset" },
      { value: 7, name: "Longest Extended" },
    ]

}
