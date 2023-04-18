import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewstypeModalComponent } from './form-newstype-modal.component';

describe('FormNewstypeModalComponent', () => {
  let component: FormNewstypeModalComponent;
  let fixture: ComponentFixture<FormNewstypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormNewstypeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewstypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
