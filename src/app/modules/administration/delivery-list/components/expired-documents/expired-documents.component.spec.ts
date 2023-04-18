import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredDocumentsComponent } from './expired-documents.component';

describe('ExpiredDocumentsComponent', () => {
  let component: ExpiredDocumentsComponent;
  let fixture: ComponentFixture<ExpiredDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
