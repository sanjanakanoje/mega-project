import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestScreen } from './test-screen';

describe('TestScreen', () => {
  let component: TestScreen;
  let fixture: ComponentFixture<TestScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(TestScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
