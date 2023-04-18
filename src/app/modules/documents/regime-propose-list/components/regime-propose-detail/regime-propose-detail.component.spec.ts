import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeProposeDetailComponent } from './regime-propose-detail.component';

describe('RegimeProposeDetailComponent', () => {
  let component: RegimeProposeDetailComponent;
  let fixture: ComponentFixture<RegimeProposeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeProposeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeProposeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
