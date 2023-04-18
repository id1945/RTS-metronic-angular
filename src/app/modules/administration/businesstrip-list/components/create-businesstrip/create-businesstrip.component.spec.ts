import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  CreateBusinessTripComponent } from './create-businesstrip.component';

describe('CreateBusinessTripComponent', () => {
  let component: CreateBusinessTripComponent;
  let fixture: ComponentFixture<CreateBusinessTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBusinessTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinessTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
