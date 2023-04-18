import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeExpiredComponent } from './regime-expired.component';

describe('RegimeExpiredComponent', () => {
  let component: RegimeExpiredComponent;
  let fixture: ComponentFixture<RegimeExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeExpiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
