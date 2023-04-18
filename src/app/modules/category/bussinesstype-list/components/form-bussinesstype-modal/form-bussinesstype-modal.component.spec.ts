import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBussinesstypeModalComponent } from './form-bussinesstype-modal.component';

describe('FormBussinesstypeModalComponent', () => {
  let component: FormBussinesstypeModalComponent;
  let fixture: ComponentFixture<FormBussinesstypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBussinesstypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBussinesstypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
