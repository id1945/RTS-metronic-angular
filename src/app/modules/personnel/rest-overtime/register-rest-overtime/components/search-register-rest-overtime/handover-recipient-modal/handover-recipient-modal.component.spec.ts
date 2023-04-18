import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverRecipientModalComponent } from './handover-recipient-modal.component';

describe('HandoverRecipientModalComponent', () => {
  let component: HandoverRecipientModalComponent;
  let fixture: ComponentFixture<HandoverRecipientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandoverRecipientModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoverRecipientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
