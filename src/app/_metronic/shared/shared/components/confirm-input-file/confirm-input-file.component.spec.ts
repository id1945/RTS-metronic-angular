import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInputFileComponent } from './confirm-input-file.component';

describe('ConfirmInputFileComponent', () => {
  let component: ConfirmInputFileComponent;
  let fixture: ComponentFixture<ConfirmInputFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmInputFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInputFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
