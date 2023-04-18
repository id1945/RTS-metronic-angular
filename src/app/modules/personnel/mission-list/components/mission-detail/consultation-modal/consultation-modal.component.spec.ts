import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationModalComponent } from './consultation-modal.component';

describe('ConsultationModalComponent', () => {
  let component: ConsultationModalComponent;
  let fixture: ComponentFixture<ConsultationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
