import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPostsModalComponent } from './form-posts-modal.component';

describe('FormPostsModalComponent', () => {
  let component: FormPostsModalComponent;
  let fixture: ComponentFixture<FormPostsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPostsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPostsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
