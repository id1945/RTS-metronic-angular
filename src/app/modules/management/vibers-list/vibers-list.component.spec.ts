import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VibersListComponent } from './vibers-list.component';

describe('VibersListComponent', () => {
  let component: VibersListComponent;
  let fixture: ComponentFixture<VibersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VibersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VibersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
