import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleList } from './sample-list';

describe('SampleList', () => {
  let component: SampleList;
  let fixture: ComponentFixture<SampleList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleList],
    }).compileComponents();

    fixture = TestBed.createComponent(SampleList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
