import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  DetailBusinessTripComponent } from './detail-businesstrip.component';

describe('DetailBusinessTripComponent', () => {
  let component: DetailBusinessTripComponent;
  let fixture: ComponentFixture<DetailBusinessTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBusinessTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
