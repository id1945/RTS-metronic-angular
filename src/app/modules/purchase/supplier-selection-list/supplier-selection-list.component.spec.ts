import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSelectionListComponent } from './supplier-selection-list.component';

describe('SupplierSelectionListComponent', () => {
  let component: SupplierSelectionListComponent;
  let fixture: ComponentFixture<SupplierSelectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierSelectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
