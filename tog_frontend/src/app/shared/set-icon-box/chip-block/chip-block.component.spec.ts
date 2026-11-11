import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipBlockComponent } from './chip-block.component';

describe('ChipBlockComponent', () => {
  let component: ChipBlockComponent;
  let fixture: ComponentFixture<ChipBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChipBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChipBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
