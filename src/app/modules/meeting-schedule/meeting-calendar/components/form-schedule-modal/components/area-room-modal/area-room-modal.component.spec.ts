import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaRoomModalComponent } from './area-room-modal.component';

describe('AreaRoomModalComponent', () => {
  let component: AreaRoomModalComponent;
  let fixture: ComponentFixture<AreaRoomModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaRoomModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaRoomModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
