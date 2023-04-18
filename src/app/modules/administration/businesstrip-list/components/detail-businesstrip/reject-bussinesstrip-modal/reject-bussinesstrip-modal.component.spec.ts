import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectBussinessTripModalComponent } from './reject-bussinesstrip-modal.component';

describe('RejectBussinessTripModalComponent', () => {
  let component: RejectBussinessTripModalComponent;
  let fixture: ComponentFixture<RejectBussinessTripModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectBussinessTripModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectBussinessTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
