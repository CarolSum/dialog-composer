import React from 'react';
// import logo from './logo.svg';
import './App.css';

const delta = 100;
let H: number = 0;
const totalTime = 800;

let tid: NodeJS.Timeout | undefined;

function stopWheel(e: any) {
  if(!e){ e = window.event; } /* IE7, IE8, Chrome, Safari */
  if(e.preventDefault) { e.preventDefault(); } /* Chrome, Safari, Firefox */
  e.returnValue = false; /* IE7, IE8 */
}

function cubicBezier(p1: [any, any], cp1: [any, any], cp2: [any, any], p2: [any, any]) {
  // 起始点
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  // 控制点
  const [cx1, cy1] = cp1;
  const [cx2, cy2] = cp2;
   
  return (t: any) => {
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

const getCurrentBezierPoint = cubicBezier([0, 0], [0.0, 0], [0.0, 1], [1, 1]);

class App extends React.Component {

  private sectionId: number = 0;
  private originX: number | null = 0;
  private originY: number | null = 0;

  setOriginPoint = (e: TouchEvent) => {
    if (e.touches.length) {
      const touchPoint = e.touches[0];
      this.originX = touchPoint.screenX;
      this.originY = touchPoint.screenY;
    }
  }

  clearPoint = () => {
    this.originX = null;
    this.originY = null;
  }

  getSectionList() {
    return document.getElementsByClassName('section');
  }

  componentDidMount() {
    console.log(window.innerHeight);
    console.log(window.screen.height);
    // H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // H = window.screen.height;

    const list = document.getElementsByClassName('section');
    for (let i = 0; i < list.length; i++) {
      console.log(list[i].getBoundingClientRect().height);
    }
    H = list[0].getBoundingClientRect().height;
    
    console.log(this);
    // 禁用浏览器滚动事件
    window.addEventListener('DOMMouseScroll', stopWheel, { passive: false });
    window.addEventListener('mousewheel', stopWheel, { passive: false });

    // 记录点击位置
    window.addEventListener('touchstart', this.setOriginPoint, false);

    // 监听滑动事件, 移动端没有 mousemove 事件
    window.addEventListener('touchmove', this.handleMouseMove,  { passive: false });

    window.addEventListener('touchend', this.clearPoint, false);
  }

  handleMouseMove = (e: TouchEvent) => {
    console.log(e);
    if (!e.touches.length) return;
    const point = e.touches[0];
    if (!point.screenX || !point.screenY) return;

    if (this.originX && this.originY) {
      const deltaY = Math.abs(point.screenY - this.originY);
      if (deltaY > delta) {
        // true: 向上; false: 向下;
        const flag = this.originY > point.screenY;
        this.switchScene(flag);
        this.clearPoint();
      }
    }
    e.preventDefault();
  }

  componentWillUnmount() {
    window.removeEventListener('DOMMouseScroll', stopWheel);
    window.removeEventListener('mousewheel', stopWheel);

    window.removeEventListener('touchstart', this.setOriginPoint, false);
    window.removeEventListener('touchmove', this.handleMouseMove, false);
    window.removeEventListener('touchend', this.clearPoint, false);
  }

  switchScene(dir: boolean) {
    if (dir) {
      console.log('sid: ', this.sectionId);
      if (this.sectionId >= 8) return;
      H = this.getSectionList()[this.sectionId].getBoundingClientRect().height;
      // 差值更新 document.scrollintElement.scrollTop
      this.interpolate(1);

      this.sectionId += 1;
    } else {
      console.log('sid: ', this.sectionId);
      if (this.sectionId <= 0) return;
      H = this.getSectionList()[this.sectionId].getBoundingClientRect().height;
      this.interpolate(-1);
      this.sectionId -= 1;
    }
  }

  interpolate(abs: number) {
    if (tid || !H) return;
    const sTop = document.scrollingElement!.scrollTop;
    const curTime = Date.now();

    tid = setInterval(() => {
      const t = Date.now();
      const diff = t - curTime;
      const percent = diff / totalTime;

      if (diff >= totalTime) {
        document.scrollingElement!.scrollTop = sTop + H * abs;

        console.log('scrollTop: ', document.scrollingElement!.scrollTop);
        tid && clearInterval(tid);
        tid = undefined;
      } else {
        const [x, y] = getCurrentBezierPoint(percent);
        document.scrollingElement!.scrollTop = sTop + y * H * abs;

        console.log('scrollTop: ', document.scrollingElement!.scrollTop);
        console.log('cur: ', x, y);
      }
    }, 0);
  }
  
  render() {
    return (
      <div className="App">
        <div className="section scene0"></div>
        <div className="section scene1"></div>
        <div className="section scene2"></div>
        <div className="section scene3"></div>
        <div className="section scene4"></div>
        <div className="section scene5"></div>
        <div className="section scene6"></div>
        <div className="section scene7"></div>
        <div className="section scene8"></div>
      </div>
    );
  }
}

export default App;
