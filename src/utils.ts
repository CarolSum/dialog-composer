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

export class AudioController {

  private static playingNode: HTMLMediaElement | null = null;

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
    if (forceReplace && this.playingNode) {
      this.playingNode.pause();
      this.playingNode.currentTime = 0;
      this.playingNode = null;
    }
    const node = document.querySelector(id) as HTMLMediaElement;
    if (!node) return Promise.resolve();
    this.playingNode = node;
    node.pause();
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
    await this.play(id);
  }
}