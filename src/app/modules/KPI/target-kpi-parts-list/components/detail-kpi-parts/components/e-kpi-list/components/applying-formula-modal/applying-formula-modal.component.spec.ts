import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyingFormulaModalComponent } from './applying-formula-modal.component';

describe('ApplyingFormulaModalComponent', () => {
  let component: ApplyingFormulaModalComponent;
  let fixture: ComponentFixture<ApplyingFormulaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyingFormulaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyingFormulaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
