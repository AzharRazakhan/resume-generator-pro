import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumePdf } from './resume-pdf';

describe('ResumePdf', () => {
  let component: ResumePdf;
  let fixture: ComponentFixture<ResumePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumePdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
