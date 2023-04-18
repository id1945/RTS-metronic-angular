import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesstripModalComponent } from './form-bussinesstrip-modal.component';

describe('BussinesstripModalComponent', () => {
  let component: BussinesstripModalComponent;
  let fixture: ComponentFixture<BussinesstripModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesstripModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinesstripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
