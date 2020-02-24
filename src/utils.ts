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

export function isIOS() {
  const u = navigator.userAgent;
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  return isiOS;
}

export function isWeixin() {
  const ua = window.navigator.userAgent.toLowerCase();
  return !!ua.match(/micromessenger/i);
}

export function animateCSS(element: string, animationName: string[], callback?: any) {
  const node = document.querySelector(element);
  if (!node) return Promise.resolve(true);

  return new Promise((resolve, reject) => {
    node.classList.add('animated', ...animationName);
    
    function handleAnimationEnd() {
      if (!node) {
        reject(false);
        return;
      }
      node.classList.remove('animated', ...animationName);
      node.removeEventListener('animationend', handleAnimationEnd);
      if (typeof callback === 'function') callback();
      resolve(true);
    }
  
    node.addEventListener('animationend', handleAnimationEnd);
  });
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

export function setElementStyle(selector: string, obj: { [key: string] : string }) {
  const nodes = document.querySelectorAll(selector);
  if (nodes && nodes.length > 0) {
    nodes.forEach(node => {
      for (let k in obj) {
        console.log(k, obj[k]);
        ((node as HTMLElement).style as any)[k] = obj[k];
      }
    })
  }
}

const Ow = 1280;
const Oh = 2272;

interface IPos{
  left: number;
  top: number;
}

export function measureLeft(left: number, top: number): IPos {
  const { innerHeight, innerWidth } = window;

  if ((Oh / Ow ) > (innerHeight / innerWidth)) {
    // 高撑满，宽不足

    // 背景图在窗口内的大小
    const th = innerHeight;
    const tw = th * Ow / Oh;

    // 宽撑满之后的高
    const Nh = th * (innerWidth / tw);
    const newTop = (top * Nh - (Nh -innerHeight) / 2) / innerHeight;

    return {
      top: newTop,
      left,
    }
  } else if ((Oh / Ow) < (innerHeight / innerWidth)) {
    // 宽撑满，高不足

    // 背景图在窗口内的大小
    const tw = innerWidth;
    const th = tw * (Oh / Ow);

    // 高度撑满后的宽
    const Nw = tw * (innerHeight / th);
    const newLeft = (left * Nw - (Nw - innerWidth) / 2) / innerWidth;
    return {
      top,
      left: newLeft,
    };
  } else {
    // 表明图片尺寸和窗口大小比例一致
    // 则根据图片中元素位置的比例返回
    return {
      top,
      left,
    }
  }
}

export function measureWidth(width: number): number {
  const { innerHeight, innerWidth } = window;

  if ((Oh / Ow ) > (innerHeight / innerWidth)) {
    // 高撑满，宽不足  ===> 宽满，所以比例不变，直接返回
    return width;
  } else {
    // 宽撑满，高不足
    // 背景图在窗口内的大小
    const tw = innerWidth;
    const th = tw * (Oh / Ow);

    return width * (innerHeight / th);
  }
}

export function measureHeight(height: number): number {
  const { innerHeight, innerWidth } = window;

  if ((Oh / Ow ) > (innerHeight / innerWidth)) {
    // 高撑满，宽不足
    // 背景图在窗口内的大小
    const th = innerHeight;
    const tw = th * Ow / Oh;
    return height * (innerWidth / tw);
  } else {
    return height;
  }
}

export class AudioController {

  public static loadOne(id: string) {
    const node = document.querySelector(id) as HTMLMediaElement;
    if (!node) return;
    node.load();
  }

  public static load() {
    AudioController.loadOne('#music_bg');
    AudioController.loadOne(`#music1`);
    AudioController.loadOne(`#music2_2`);
    AudioController.loadOne(`#music2_1`);
    for (let i = 3; i < 9; i++) {
      AudioController.loadOne(`#music${i}`);
    }
  }

  public static mutePlay(id: string) {
    const node = document.querySelector(id) as HTMLMediaElement;
    if (!node) return;
    node.muted = true;
    node.play().then(() => {
      console.log(`mute play ${id} success`);
    }).catch(e => {
      console.log(id);
    });
  }

  public static play(id: string, forceReplace?: boolean) {
    const node = document.querySelector(id) as HTMLMediaElement;
    if (!node) return Promise.resolve();
  
    node.currentTime = 0;
    node.muted = false;
    node.play().then(() => {
      console.log(`play ${id} success`);
    }).catch(e => {
      console.log(e);  
    }).finally(() => {
      return Promise.resolve();
    })
  }

  public static async syncPlay(id: string) {
    return await this.play(id);
  }
}

export function canvas2Image(canvas: HTMLCanvasElement, width: number, height: number) {
  canvas.toDataURL('image/png');
  // const retCanvas = document.createElement('canvas');
  // const retCtx = retCanvas.getContext('2d');
  // retCanvas.width = width;
  // retCanvas.height = height;
  // retCtx!.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
  const img = document.createElement('img');
  img.src = canvas.toDataURL('image/jpeg');  // 可以根据需要更改格式
  return img;
}