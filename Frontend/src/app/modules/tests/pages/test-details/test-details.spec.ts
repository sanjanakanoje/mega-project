import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDetails } from './test-details';

describe('TestDetails', () => {
  let component: TestDetails;
  let fixture: ComponentFixture<TestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(TestDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
