import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeNewComponent } from './regime-new.component';

describe('RegimeNewComponent', () => {
  let component: RegimeNewComponent;
  let fixture: ComponentFixture<RegimeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegimeNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
