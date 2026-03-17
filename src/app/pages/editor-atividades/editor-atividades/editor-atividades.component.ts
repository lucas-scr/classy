import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { configurarInteract } from '../../../shared/utils/interact-config';
import { Elemento } from '../../../model/elemento-editor';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editor-atividades',
  imports: [FormsModule, CommonModule],
  templateUrl: './editor-atividades.component.html',
  styleUrl: './editor-atividades.component.css'
})
export class EditorAtividadesComponent implements AfterViewInit {

  @Input() elementos: any[] = [];
  @Output() elementosChange = new EventEmitter<any[]>();


  elementoSelecionadoId: number | null = null;


 ngAfterViewInit(): void {
    configurarInteract(
      (event: any) => this.onDragMove(event),
      (event: any) => this.onResize(event)
    );
  }

  onDragMove(event: any) {
    const id = Number(event.currentTarget.getAttribute('data-id'));
    const item = this.elementos.find(e => e.id === id);
    if (!item) return;

    this.elementoSelecionadoId = id;
    item.x += event.dx;
    item.y += event.dy;
  }

  onResize(event: any) {
    const id = Number(event.currentTarget.getAttribute('data-id'));
    const item = this.elementos.find(e => e.id === id);
    if (!item) return;

    item.width = event.rect.width;
    item.height = event.rect.height;
  }

  selecionarElemento(id: number) {
    this.elementoSelecionadoId = id;
  }

  removerElemento(id: number) {
    this.elementos = this.elementos.filter(e => e.id !== id);
    this.elementoSelecionadoId = null;
  }

  rotacionarElemento(id: number) {
    const item = this.elementos.find(e => e.id === id);
    if (!item) return;

    item.rotate += 15;
  }

  getStyle(item: Elemento) {
    return {
      transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      width: item.width + 'px',
      height: item.height + 'px',
      position: 'absolute'
    };
  }
}
