import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportParcelModalComponent } from './export-parcel-modal.component';

describe('ExportParcelModalComponent', () => {
  let component: ExportParcelModalComponent;
  let fixture: ComponentFixture<ExportParcelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportParcelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportParcelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
