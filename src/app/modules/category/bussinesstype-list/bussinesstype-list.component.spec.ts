import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesstypeListComponent } from './bussinesstype-list.component';

describe('BussinesstypeListComponent', () => {
  let component: BussinesstypeListComponent;
  let fixture: ComponentFixture<BussinesstypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesstypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinesstypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
