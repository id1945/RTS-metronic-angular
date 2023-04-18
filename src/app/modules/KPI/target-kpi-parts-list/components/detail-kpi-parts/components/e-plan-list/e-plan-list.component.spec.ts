import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPlanListComponent } from './e-plan-list.component';

describe('EPlanListComponent', () => {
  let component: EPlanListComponent;
  let fixture: ComponentFixture<EPlanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPlanListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
