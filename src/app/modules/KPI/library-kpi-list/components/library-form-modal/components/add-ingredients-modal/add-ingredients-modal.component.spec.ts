import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIngredientsModalComponent } from './add-ingredients-modal.component';

describe('AddIngredientsModalComponent', () => {
  let component: AddIngredientsModalComponent;
  let fixture: ComponentFixture<AddIngredientsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIngredientsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIngredientsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
