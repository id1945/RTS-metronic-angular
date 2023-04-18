import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromulgateListComponent } from './promulgate-list.component';

describe('PromulgateListComponent', () => {
  let component: PromulgateListComponent;
  let fixture: ComponentFixture<PromulgateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromulgateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromulgateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
