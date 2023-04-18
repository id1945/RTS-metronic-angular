import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFileComponent } from './link-file.component';

describe('LinkFileComponent', () => {
  let component: LinkFileComponent;
  let fixture: ComponentFixture<LinkFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
