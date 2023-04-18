import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeDetailComponent } from './regime-detail.component';

describe('RegimeDetailComponent', () => {
  let component: RegimeDetailComponent;
  let fixture: ComponentFixture<RegimeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
