import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeProposeFormModalComponent } from './regime-propose-form-modal.component';

describe('RegimeProposeFormModalComponent', () => {
  let component: RegimeProposeFormModalComponent;
  let fixture: ComponentFixture<RegimeProposeFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeProposeFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeProposeFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
