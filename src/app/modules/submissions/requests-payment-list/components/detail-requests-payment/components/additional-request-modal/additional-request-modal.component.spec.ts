import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalRequestModalComponent } from './additional-request-modal.component';

describe('AdditionalRequestModalComponent', () => {
  let component: AdditionalRequestModalComponent;
  let fixture: ComponentFixture<AdditionalRequestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalRequestModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalRequestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
