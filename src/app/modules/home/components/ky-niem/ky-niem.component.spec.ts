import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KyNiemComponent } from './ky-niem.component';

describe('KyNiemComponent', () => {
  let component: KyNiemComponent;
  let fixture: ComponentFixture<KyNiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KyNiemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KyNiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
