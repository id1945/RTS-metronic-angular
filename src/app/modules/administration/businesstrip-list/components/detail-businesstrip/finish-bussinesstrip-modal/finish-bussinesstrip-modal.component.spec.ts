import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishBussinessTripModalComponent } from './finish-bussinesstrip-modal.component';

describe('FinishBussinessTripModalComponent', () => {
  let component: FinishBussinessTripModalComponent;
  let fixture: ComponentFixture<FinishBussinessTripModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishBussinessTripModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishBussinessTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
