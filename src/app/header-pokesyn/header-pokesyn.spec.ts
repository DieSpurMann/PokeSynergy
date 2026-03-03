import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPokesyn } from './header-pokesyn';

describe('HeaderPokesyn', () => {
  let component: HeaderPokesyn;
  let fixture: ComponentFixture<HeaderPokesyn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPokesyn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPokesyn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
