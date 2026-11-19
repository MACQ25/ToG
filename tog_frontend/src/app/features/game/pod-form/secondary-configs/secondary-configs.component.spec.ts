import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryConfigsComponent } from './secondary-configs.component';

describe('SecondaryConfigsComponent', () => {
  let component: SecondaryConfigsComponent;
  let fixture: ComponentFixture<SecondaryConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryConfigsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
