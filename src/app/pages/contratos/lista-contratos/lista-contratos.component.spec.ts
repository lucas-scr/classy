import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaContratosComponent } from './lista-contratos.component';

describe('ListaContratosComponent', () => {
  let component: ListaContratosComponent;
  let fixture: ComponentFixture<ListaContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaContratosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
