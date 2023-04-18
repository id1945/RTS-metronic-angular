import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeFormModalComponent } from './regime-form-modal.component';

describe('RegimeFormModalComponent', () => {
  let component: RegimeFormModalComponent;
  let fixture: ComponentFixture<RegimeFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
