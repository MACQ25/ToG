import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorlabelComponent } from './errorlabel.component';

describe('ErrorlabelComponent', () => {
  let component: ErrorlabelComponent;
  let fixture: ComponentFixture<ErrorlabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorlabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
