import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETargetListComponent } from './e-target-list.component';

describe('ETargetListComponent', () => {
  let component: ETargetListComponent;
  let fixture: ComponentFixture<ETargetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ETargetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ETargetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
