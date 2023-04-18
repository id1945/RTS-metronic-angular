import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKpiPartsComponent } from './detail-kpi-parts.component';

describe('DetailKpiPartsComponent', () => {
  let component: DetailKpiPartsComponent;
  let fixture: ComponentFixture<DetailKpiPartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailKpiPartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKpiPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
