import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameReturnButtonComponent } from './game-return-button.component';

describe('GameReturnButtonComponent', () => {
  let component: GameReturnButtonComponent;
  let fixture: ComponentFixture<GameReturnButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameReturnButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameReturnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
