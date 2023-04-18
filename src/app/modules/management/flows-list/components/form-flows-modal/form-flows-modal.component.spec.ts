import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFlowsModalComponent } from './form-flows-modal.component';

describe('FormFlowsModalComponent', () => {
  let component: FormFlowsModalComponent;
  let fixture: ComponentFixture<FormFlowsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFlowsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFlowsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
