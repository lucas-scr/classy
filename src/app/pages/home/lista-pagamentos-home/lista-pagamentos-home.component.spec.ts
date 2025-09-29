import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPagamentosHomeComponent } from './lista-pagamentos-home.component';

describe('ListaPagamentosHomeComponent', () => {
  let component: ListaPagamentosHomeComponent;
  let fixture: ComponentFixture<ListaPagamentosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPagamentosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPagamentosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
