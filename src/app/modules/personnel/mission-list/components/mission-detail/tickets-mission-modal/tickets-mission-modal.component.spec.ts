import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsMissionModalComponent } from './tickets-mission-modal.component';

describe('TicketsMissionModalComponent', () => {
  let component: TicketsMissionModalComponent;
  let fixture: ComponentFixture<TicketsMissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsMissionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsMissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
