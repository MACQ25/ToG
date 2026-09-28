import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCardUIComponent } from './form-card-ui.component';

describe('FormCardUIComponent', () => {
  let component: FormCardUIComponent;
  let fixture: ComponentFixture<FormCardUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCardUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCardUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
