import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSamples } from './view-samples';

describe('ViewSamples', () => {
  let component: ViewSamples;
  let fixture: ComponentFixture<ViewSamples>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSamples],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSamples);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
