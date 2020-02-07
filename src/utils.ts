export function setDocHeight() {
  console.log('set doc height');
  console.log(window.innerHeight);
  document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
};

export function stopWheel(e: any) {
  if(!e){ e = window.event; } /* IE7, IE8, Chrome, Safari */
  if(e.preventDefault) { e.preventDefault(); } /* Chrome, Safari, Firefox */
  e.returnValue = false; /* IE7, IE8 */
}

export function animateCSS(element: string, animationName: string[], callback?: any) {
  const node = document.querySelector(element);
  if (!node) return;
  node.classList.add('animated', ...animationName);

  function handleAnimationEnd() {
    if (!node) return;
    node.classList.remove('animated', ...animationName);
    node.removeEventListener('animationend', handleAnimationEnd);
    if (typeof callback === 'function') callback();
  }

  node.addEventListener('animationend', handleAnimationEnd);
}


export function cubicBezier(p1: [number, number], cp1: [number, number], cp2: [number, number], p2: [number, number]) {
  // 起始点
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  // 控制点
  const [cx1, cy1] = cp1;
  const [cx2, cy2] = cp2;
   
  return (t: number) => {
    let x =
      x1 * (1 - t) * (1 - t) * (1 - t) +
      3 * cx1 * t * (1 - t) * (1 - t) +
      3 * cx2 * t * t * (1 - t) +
      x2 * t * t * t;
    let y =
      y1 * (1 - t) * (1 - t) * (1 - t) +
      3 * cy1 * t * (1 - t) * (1 - t) +
      3 * cy2 * t * t * (1 - t) +
      y2 * t * t * t;
    return [x, y];
  };
}