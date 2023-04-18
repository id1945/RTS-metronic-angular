import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionsDetailComponent } from './submissions-detail.component';

describe('SubmissionsDetailComponent', () => {
  let component: SubmissionsDetailComponent;
  let fixture: ComponentFixture<SubmissionsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmissionsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
