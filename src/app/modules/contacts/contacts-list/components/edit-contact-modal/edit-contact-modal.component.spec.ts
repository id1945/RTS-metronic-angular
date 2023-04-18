import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactModalComponent } from './edit-contact-modal.component';

describe('EditContactModalComponent', () => {
  let component: EditContactModalComponent;
  let fixture: ComponentFixture<EditContactModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContactModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
