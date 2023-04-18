import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningBussinessTripModalComponent } from './running-bussinesstrip-modal.component';

describe('RunningBussinessTripModalComponent', () => {
  let component: RunningBussinessTripModalComponent;
  let fixture: ComponentFixture<RunningBussinessTripModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunningBussinessTripModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningBussinessTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
