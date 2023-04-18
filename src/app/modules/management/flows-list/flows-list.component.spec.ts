import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsListComponent } from './flows-list.component';

describe('FlowsListComponent', () => {
  let component: FlowsListComponent;
  let fixture: ComponentFixture<FlowsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
