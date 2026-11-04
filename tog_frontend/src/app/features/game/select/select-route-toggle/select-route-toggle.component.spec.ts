import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRouteToggleComponent } from './select-route-toggle.component';

describe('SelectRouteToggleComponent', () => {
  let component: SelectRouteToggleComponent;
  let fixture: ComponentFixture<SelectRouteToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRouteToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRouteToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
