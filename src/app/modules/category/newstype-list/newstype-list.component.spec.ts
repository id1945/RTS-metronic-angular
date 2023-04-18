import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewstypeListComponent } from './newstype-list.component';

describe('NewstypeListComponent', () => {
  let component: NewstypeListComponent;
  let fixture: ComponentFixture<NewstypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewstypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewstypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
