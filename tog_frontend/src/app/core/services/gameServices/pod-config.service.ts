import { inject, Injectable } from '@angular/core';
import { Mode, ProgressionStart, ConstructedFormat, TertiaryKind } from './pod-config.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import releaseDates from './releaseDates.json'

export interface verboseOption {
    value: null | number 
    name: string
    desc?: string
}

@Injectable({ providedIn: 'root' })
export class PodConfigService {
 
    readonly modes: verboseOption[] = [
      {value: null, name: "Select a format" },
      {value: Mode.Progression, name: "Progression" },
      {value: Mode.League, name: "league" },
      {value: Mode.Constructed, name: "Constructed"},
      {value: Mode.Custom, name: "Custom"},
    ]
    
    readonly progression: verboseOption[] = [
      { value: null, name: "Pick one", desc: "" },
      { value: ProgressionStart.OldSchool, name: "old school 93-94", desc: "Start a pod like you are one of the first few to get a hold of alpha and beta, era of moxes and 'the deck'"},
      { value: ProgressionStart.ProTour, name: "PT", desc: "Start progression with the pool of sets featured at the first pro-tour, 4th edition onwards!"},
      { value: ProgressionStart.Year1999, name: "1999", desc: "The game as it was after Urza block, the later half of premodern, starting at 6th Edition"},
      { value: ProgressionStart.Modern, name: "Modern", desc: "The unveiling of a new frame, the starting point of one of magic's most beloved formats"},
      { value: ProgressionStart.SpecificSet, name: "Specific set", desc: "Alright, got nostalgia for a specific set you started with? put it here and run the pod that way"}, 
    ]

    readonly constructed: verboseOption[] = [
      { value: null, name: "Pick one" , desc: "" },
      { value: ConstructedFormat.T2, name: "T2" , desc: "Flashback to a standard of years past" },
      { value: ConstructedFormat.BlockConstructed, name: "Block Constructed" , desc: "Constructed format limited to the pool of blocks of days past" },
    ]

    readonly t2 = [
      { value: null, name: "Select a range", label: "Select a range" },
      { value: 1, name: "Smart", label: 'historic'},
      { value: 2, name: "Planar Standard", label: '2 Years'},
      { value: 3, name: "Long Standard" , label: '3 Years'},
      { value: 4, name: "Extended Sunset", label: '4 Years' },
      { value: 7, name: "Longest Extended", label: '7 Years' },
    ]


    MODE_RULES: Record<number, { options: (pcs: PodConfigService) => any[] }> = {
      1: { options: pcs => pcs.progression },
      2: { options: () => [] },
      3: { options: pcs => pcs.constructed },
    };

    
    tertiaryKindFor(mode: number | null, secondary: number | null): TertiaryKind {
      if (mode === Mode.Progression && secondary === ProgressionStart.SpecificSet) return 'members';
      if (mode === Mode.Constructed && secondary === ConstructedFormat.T2) return 'standard';
      if (mode === Mode.Constructed && secondary === ConstructedFormat.BlockConstructed) return 'block'; // guess
      return null;
    }

    /*

    private readonly releaseData = new Map<string, Map<string, number[]>>(
      Object.entries(releaseDates).map(([outerKey, inner]) => [
        outerKey,
        new Map(Object.entries(inner as unknown as Record<string, number[]>)),
      ])
    );

    checkRelease(year: string, month: string, day: number){
      
      let dYear = this.releaseData.get(year);
      if (dYear === undefined) return false;

      let dMonth = dYear.get(month)
      if (dMonth === undefined) return false;

      return dMonth.includes(day);
    }

    */
}
