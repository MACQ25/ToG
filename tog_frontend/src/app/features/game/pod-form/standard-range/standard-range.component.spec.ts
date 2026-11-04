import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardRangeComponent } from './standard-range.component';

describe('StandardRangeComponent', () => {
  let component: StandardRangeComponent;
  let fixture: ComponentFixture<StandardRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
