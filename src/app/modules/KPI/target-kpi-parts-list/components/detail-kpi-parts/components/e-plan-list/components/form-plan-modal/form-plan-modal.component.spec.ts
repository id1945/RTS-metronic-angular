import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPlantModalComponent } from './form-plan-modal.component';

describe('FormPlantModalComponent', () => {
  let component: FormPlantModalComponent;
  let fixture: ComponentFixture<FormPlantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPlantModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPlantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
