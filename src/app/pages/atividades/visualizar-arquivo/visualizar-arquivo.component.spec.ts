import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarArquivoComponent } from './visualizar-arquivo.component';

describe('VisualizarArquivoComponent', () => {
  let component: VisualizarArquivoComponent;
  let fixture: ComponentFixture<VisualizarArquivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarArquivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarArquivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
