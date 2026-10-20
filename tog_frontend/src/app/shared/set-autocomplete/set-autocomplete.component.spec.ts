import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAutocompleteComponent } from './set-autocomplete.component';

describe('SetAutocompleteComponent', () => {
  let component: SetAutocompleteComponent;
  let fixture: ComponentFixture<SetAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
