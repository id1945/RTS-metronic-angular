import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicContentModalComponent } from './basic-content-modal.component';

describe('BasicContentModalComponent', () => {
  let component: BasicContentModalComponent;
  let fixture: ComponentFixture<BasicContentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicContentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
