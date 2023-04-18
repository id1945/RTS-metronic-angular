import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetKpiPartsListComponent } from './target-kpi-parts-list.component';

describe('TargetKpiPartsListComponent', () => {
  let component: TargetKpiPartsListComponent;
  let fixture: ComponentFixture<TargetKpiPartsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetKpiPartsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetKpiPartsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
