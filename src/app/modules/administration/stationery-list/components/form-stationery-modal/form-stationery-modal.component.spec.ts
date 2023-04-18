import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationeryModalComponent } from './form-stationery-modal.component';

describe('StationeryModalComponent', () => {
  let component: StationeryModalComponent;
  let fixture: ComponentFixture<StationeryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationeryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationeryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
