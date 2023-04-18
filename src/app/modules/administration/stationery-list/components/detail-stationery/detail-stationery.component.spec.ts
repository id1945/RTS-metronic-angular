import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStationeryComponent } from './detail-stationery.component';

describe('DetailStationeryComponent', () => {
  let component: DetailStationeryComponent;
  let fixture: ComponentFixture<DetailStationeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailStationeryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailStationeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
