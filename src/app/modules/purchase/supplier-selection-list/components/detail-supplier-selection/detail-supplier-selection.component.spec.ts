import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSupplierSelectionComponent } from './detail-supplier-selection.component';

describe('DetailSupplierSelectionComponent', () => {
  let component: DetailSupplierSelectionComponent;
  let fixture: ComponentFixture<DetailSupplierSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSupplierSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSupplierSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
