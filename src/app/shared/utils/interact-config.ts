import interact from 'interactjs';

export function configurarInteract(moveFn: any, resizeFn: any) {

  interact('.draggable').unset();

  interact('.draggable')
    .draggable({
      inertia: true, // movimento mais suave
      autoScroll: true,
      listeners: {
        move: moveFn
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      inertia: true,
      listeners: {
        move: resizeFn
      }
    });
}