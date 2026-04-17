import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleDetails } from './sample-details';

describe('SampleDetails', () => {
  let component: SampleDetails;
  let fixture: ComponentFixture<SampleDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SampleDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
