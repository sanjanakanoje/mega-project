import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTestStatus } from './update-test-status';

describe('UpdateTestStatus', () => {
  let component: UpdateTestStatus;
  let fixture: ComponentFixture<UpdateTestStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTestStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTestStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
