import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestRequest } from './create-test-request';

describe('CreateTestRequest', () => {
  let component: CreateTestRequest;
  let fixture: ComponentFixture<CreateTestRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTestRequest],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTestRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
