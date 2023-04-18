import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetKPIListComponent } from './target-kpi-list.component';

describe('TargetKPIListComponent', () => {
  let component: TargetKPIListComponent;
  let fixture: ComponentFixture<TargetKPIListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetKPIListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetKPIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
