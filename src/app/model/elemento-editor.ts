export interface Elemento {
  id: number;
  tipo: 'imagem';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex?: number;
}