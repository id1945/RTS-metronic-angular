import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagsButtonComponent } from './select-tags-button.component';

describe('SelectTagsButtonComponent', () => {
  let component: SelectTagsButtonComponent;
  let fixture: ComponentFixture<SelectTagsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTagsButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTagsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
