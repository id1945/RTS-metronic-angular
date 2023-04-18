import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberdocsFormModalComponent } from './numberdocs-form-modal.component';

describe('NumberdocsFormModalComponent', () => {
  let component: NumberdocsFormModalComponent;
  let fixture: ComponentFixture<NumberdocsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberdocsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberdocsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
