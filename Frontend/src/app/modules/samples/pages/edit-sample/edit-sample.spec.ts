import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSample } from './edit-sample';

describe('EditSample', () => {
  let component: EditSample;
  let fixture: ComponentFixture<EditSample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSample],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSample);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
