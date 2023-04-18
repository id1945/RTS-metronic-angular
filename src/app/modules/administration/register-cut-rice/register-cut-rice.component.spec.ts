import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCutRiceComponent } from './register-cut-rice.component';

describe('RegisterCutRiceComponent', () => {
  let component: RegisterCutRiceComponent;
  let fixture: ComponentFixture<RegisterCutRiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCutRiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCutRiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
