import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pokepage } from './pokepage';

describe('Pokepage', () => {
  let component: Pokepage;
  let fixture: ComponentFixture<Pokepage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pokepage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pokepage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
