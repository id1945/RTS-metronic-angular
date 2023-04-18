import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedWaitingComponent } from './confirmed-waiting.component';

describe('ConfirmedWaitingComponent', () => {
  let component: ConfirmedWaitingComponent;
  let fixture: ComponentFixture<ConfirmedWaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmedWaitingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmedWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
