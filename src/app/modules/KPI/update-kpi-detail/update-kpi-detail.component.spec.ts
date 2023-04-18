import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKpiDetailComponent } from './update-kpi-detail.component';

describe('UpdateKpiDetailComponent', () => {
  let component: UpdateKpiDetailComponent;
  let fixture: ComponentFixture<UpdateKpiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateKpiDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateKpiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
