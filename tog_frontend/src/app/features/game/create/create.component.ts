import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PodConfigService, verboseOption } from '../../../core/services/gameServices/pod-config.service';
import { SetsService } from '../../../core/services/cardServices/sets.service';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  
  private fb = inject(FormBuilder)

  form = this.fb.group({
    mode: new FormControl(0 || null, [Validators.required]),
    secondary: new FormControl(0 || null),
    tertiary: new FormControl('')
  });

  modes: verboseOption[];

  subSelectFlag1: number | null = 0;
  secondaryAssociation!: any[];

  subSelectFlag2: boolean = false
  blockFlag = signal<boolean>(false)


  constructor(private pcs: PodConfigService, private setServ: SetsService) {
    
    this.modes = pcs.modes

    const mode = this.form.controls.mode
    const secondary = this.form.controls.secondary;
    const tertiary = this.form.controls.tertiary;

    this.form.controls.mode.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((mode: null | number) => {

      if (Number.isInteger(mode)) {
        if(this.setAssociations(mode)) secondary.addValidators(Validators.required);
      } else {
        secondary.removeValidators(Validators.required);
        secondary.reset(null);
      }

      this.subSelectFlag1 = Number.isInteger(mode) ? mode : 0 
      secondary.updateValueAndValidity();
    });

    this.form.controls.secondary.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(secondary => {
      let modeVal = mode.value
      console.log(secondary)
    
      this.blockFlag.update(() => modeVal == 3 && secondary == 3)
      this.subSelectFlag2 = (modeVal == 1 && secondary == 5) || this.blockFlag()

      if (this.subSelectFlag2) {
        tertiary.addValidators(Validators.required);
      } else {
        tertiary.removeValidators(Validators.required);
        tertiary.reset(null);
      }

      tertiary.updateValueAndValidity()
    });
  }

  private setAssociations(selection: number | null) : boolean{
    if (!selection) this.secondaryAssociation = [];
    else {
      switch(selection){
        case 1:
          this.secondaryAssociation = this.pcs.progression
          return true
        case 2:
          this.secondaryAssociation = []
          return true
        case 3:          
          this.secondaryAssociation = this.pcs.constructed
          return true
      }
    }
    return false

  }

  get selectedSecondary() {
    const v = this.form.controls.secondary.value;
    return this.secondaryAssociation.find(s => s.value === v);
  }

  onSubmit(){
    console.log(this.form)
    this.setServ.listBlocks().subscribe(
      (res) => {
        console.log(res)
      } 
    )
  }
}
