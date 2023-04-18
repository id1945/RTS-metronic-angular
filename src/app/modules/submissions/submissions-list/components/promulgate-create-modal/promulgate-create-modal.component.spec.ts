import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromulgateCreateModalComponent } from './promulgate-create-modal.component';

describe('PromulgateCreateModalComponent', () => {
  let component: PromulgateCreateModalComponent;
  let fixture: ComponentFixture<PromulgateCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromulgateCreateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromulgateCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
