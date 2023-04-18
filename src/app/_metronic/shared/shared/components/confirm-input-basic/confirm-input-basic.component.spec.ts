import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInputBasicComponent } from './confirm-input-basic.component';

describe('ConfirmInputBasicComponent', () => {
  let component: ConfirmInputBasicComponent;
  let fixture: ComponentFixture<ConfirmInputBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInputBasicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInputBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
