import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSample } from './add-sample';

describe('AddSample', () => {
  let component: AddSample;
  let fixture: ComponentFixture<AddSample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSample],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
