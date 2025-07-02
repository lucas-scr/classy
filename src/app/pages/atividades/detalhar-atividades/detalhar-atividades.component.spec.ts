import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalharAtividadesComponent } from './detalhar-atividades.component';

describe('VisualizarAtividadesComponent', () => {
  let component: DetalharAtividadesComponent;
  let fixture: ComponentFixture<DetalharAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalharAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalharAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
