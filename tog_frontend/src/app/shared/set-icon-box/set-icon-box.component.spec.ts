import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetIconBoxComponent } from './set-icon-box.component';

describe('SetIconBoxComponent', () => {
  let component: SetIconBoxComponent;
  let fixture: ComponentFixture<SetIconBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetIconBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetIconBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
