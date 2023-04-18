import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormParcelModalComponent } from './form-parcel-modal.component';

describe('FormParcelModalComponent', () => {
  let component: FormParcelModalComponent;
  let fixture: ComponentFixture<FormParcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormParcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormParcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
