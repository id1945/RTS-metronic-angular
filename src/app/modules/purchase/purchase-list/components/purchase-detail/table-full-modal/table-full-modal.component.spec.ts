import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFullModalComponent } from './table-full-modal.component';

describe('TableFullModalComponent', () => {
  let component: TableFullModalComponent;
  let fixture: ComponentFixture<TableFullModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableFullModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFullModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
