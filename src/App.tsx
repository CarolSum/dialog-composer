import React from 'react';
// import logo from './logo.svg';
import './App.css';
import CoffeeText from './assets/coffee.png';
import ScanQRcode from './assets/scan.png';
import Subway from './assets/subway.png';
// import BgMobile from './assets/bg-mobile.png';
import Scene2Subway from './assets/subway-scene2.png';
import Scene2Bus from './assets/bus-scene2.png';
import Scene2Bike from './assets/bike-scene2.png';
// scene3
import Scene3Takeaway from './assets/takeaway-scene3.png';
import Scene3Text from './assets/text-scene3.png';
//scene 4
import Scene4Subway from './assets/subway-scene4.png';
// scene 5
import Scene5Hand from './assets/hand-scene5.png';
// scene 6
import Scene6Hand from './assets/hand-scene6.png';
// scene 7
import Letter from './assets/letter.png';
import ConfrimBtn from './assets/confirm-btn.png';
import Tag from './assets/tag.png';

import { setDocHeight } from './utils';
// import Limarquee from 'limarquee';
import { Slider } from './components/slider/slide';

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

function animateCSS(element: string, animationName: string[], callback?: any) {
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

const getCurrentBezierPoint = cubicBezier([0, 0], [0.0, 0], [0.0, 1], [1, 1]);

// 动画帧 interface
interface IAniFrame {
  selector: string;
  aniCls: string[];
  addAfterAnimation: string[];
  removeBeforeAnimation: string[];
  children?: IAniFrame[];
}

// 定义每个场景中的动画组
const animationGroup: IAniFrame[][] = [
  // scene 0
  [
    {
      selector: '.el-subway',
      aniCls: ['lr-circle', 'infinite'],
      addAfterAnimation: [],
      removeBeforeAnimation: [],
    }
  ],
  // scene 1
  [
    {
      selector: '.el-coffee',
      aniCls: ['fadeIn'],
      addAfterAnimation: ['opacity1'],  // 动画结束后添加的样式类，用于覆盖原来的样式
      removeBeforeAnimation: [],  // 动画开始前添加的样式类
      // 子动画组
      children: [
        {
          selector: '.el-scan',
          removeBeforeAnimation: ['opacity0'],
          aniCls: ['slideInUp'],
          addAfterAnimation: ['opacity1'],  // 动画结束后添加的样式类，用于覆盖原来的样式
        }
      ],
    }
  ],
  // scene 2
  [
    {
      selector: '.el-subway2',
      aniCls: ['slideInLeft'],
      addAfterAnimation: ['opacity1'],
      removeBeforeAnimation: ['opacity0']
    },
    {
      selector: '.el-bus',
      aniCls: ['slideInRight'],
      addAfterAnimation: ['opacity1'],
      removeBeforeAnimation: ['opacity0'],
      children: [
        {
          selector: '.el-bike',
          removeBeforeAnimation: ['opacity0'],
          aniCls: ['slideInUp'],
          addAfterAnimation: ['opacity1'],
        }
      ]
    }
  ],
  // scene3
  [
    {
      selector: '.el-takeaway',
      aniCls: ['takeaway-arrive'],
      addAfterAnimation: ['opacity1'],
      removeBeforeAnimation: ['opacity0'],
      children: [
        {
          selector: '.el-takeaway-text',
          aniCls: ['fadeIn'],
          addAfterAnimation: ['opacity1'],
          removeBeforeAnimation: ['opacity0'],
        },
      ]
    },
  ],
  // scene 4
  [
    {
      selector: '.el-subway3',
      aniCls: ['rl-circle', 'infinite'],
      addAfterAnimation: [],
      removeBeforeAnimation: [],
    }
  ],
  // scene 5
  [
    {
      selector: '.el-hand',
      aniCls: ['slideInUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
    }
  ],
  // scene 6
  [
    {
      selector: '.el-hand2',
      aniCls: ['slideInCenterUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
    }
  ],
  // scene 7
  [
    {
      selector: '.el-letter',
      aniCls: ['rotateUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
      children: [
        {
          selector: '.el-confirm',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        }
      ]
    },
  ]
]

interface ITempCls {
  added: string[];
  removed: string[];
}

let tempClsMap: { [key: string] : ITempCls } = {};

function animate(config: IAniFrame) {
  const target = document.querySelector(config.selector);
  if (!target) return;
  // 动画前预处理
  if (config.removeBeforeAnimation) {
    target.classList.remove(...config.removeBeforeAnimation);

    // 记录暂时移除的类
    if (!tempClsMap[config.selector]) {
      tempClsMap[config.selector] = {
        added: [],
        removed: [...config.removeBeforeAnimation],
      }
    } else {
      tempClsMap[config.selector].removed = tempClsMap[config.selector].removed.concat(config.removeBeforeAnimation);
    }
  }

  // 如果动画包含无限循环，则转场的时候也需要清除
  if (config.aniCls.includes('infinite')) {
    const cls = [...config.aniCls];
    cls.splice(cls.indexOf('infinite'), 1);

    // 记录暂时添加的类
    if (!tempClsMap[config.selector]) {
      tempClsMap[config.selector] = {
        added: [...cls],
        removed: [],
      }
    } else {
      tempClsMap[config.selector].added = tempClsMap[config.selector].added.concat(cls);
    }
  }

  // 执行指定动画
  animateCSS(config.selector, config.aniCls, function() {
    // 动画后处理
    if (config.addAfterAnimation) {
      // 添加一些样式以覆盖初始值
      target.classList.add(...config.addAfterAnimation);

      // 记录暂时添加的类
      if (!tempClsMap[config.selector]) {
        tempClsMap[config.selector] = {
          added: [...config.addAfterAnimation],
          removed: [],
        }
      } else {
        tempClsMap[config.selector].added = tempClsMap[config.selector].added.concat(config.addAfterAnimation);
      }
    }

    // 如果存在子动画
    if (config.children) {
      config.children.forEach((subCfg) => {
        animate(subCfg);
      });
    }
  })
}

// 清理上次转场时添加/删除的临时样式
function cleanUpScene() {
  for (let selector in tempClsMap) {
    const node = document.querySelector(selector);
    if (!node) continue;
    node.classList.remove(...tempClsMap[selector].added);
    node.classList.add(...tempClsMap[selector].removed);
  }
  tempClsMap = {};
}

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
    setDocHeight();
    console.log(window.innerHeight);
    console.log(window.screen.height);
    console.log(window.screenY);

    console.log(window.screen.availHeight);
 
    console.log(document.documentElement.getBoundingClientRect().height);
    // H = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // H = window.screen.height;

    const list = document.getElementsByClassName('section');
    for (let i = 0; i < list.length; i++) {
      console.log(list[i].getBoundingClientRect().height);
    }
    // H = list[0].getBoundingClientRect().height;
    
    console.log(this);
    // 禁用浏览器滚动事件
    window.addEventListener('DOMMouseScroll', stopWheel, { passive: false });
    window.addEventListener('mousewheel', stopWheel, { passive: false });

    // 记录点击位置
    window.addEventListener('touchstart', this.setOriginPoint, false);

    // 监听滑动事件, 移动端没有 mousemove 事件
    window.addEventListener('touchmove', this.handleMouseMove,  { passive: false });

    window.addEventListener('touchend', this.clearPoint, false);

    // const limarquee = new Limarquee('.tag-container');
    // limarquee.render({
    //   direction: 'left',	// 滚动方向，可选 left / right / up / down
    //   loop:	-1,	      // 循环次数，-1 为无限循环
    //   hoverstop: true,	// 鼠标悬停暂停
    // });

    // setTimeout(() => {
    //   const node = document.querySelector('.test');
    //   console.log(node);
    //   if (!node) return;
    //   node.classList.add('tag-large');
    // }, 10000);
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

       // 清理工作
       cleanUpScene();
       this.transition();
      } else {
        const [x, y] = getCurrentBezierPoint(percent);
        document.scrollingElement!.scrollTop = sTop + y * H * abs;

        console.log('scrollTop: ', document.scrollingElement!.scrollTop);
        console.log('cur: ', x, y);
      }
    }, 0);
  }

  transition() {
    if (this.sectionId < 0 || this.sectionId > 8) return;
    const frames = animationGroup[this.sectionId];
    if (!frames) return;
    frames.forEach((frame) => {
      animate(frame);
    });
  }

  handleClickTag(e: any) {
    console.log('click tag!!!');
  }
  
  render() {
    return (
      <div className="App">
        <div className="section scene0">
          <div className="subway-container">
            <img src={Subway} alt="subway" className="el-subway"/>
          </div>
        </div>
        <div className="section scene1">
          <img src={CoffeeText} alt="coffee" className="el-coffee opacity0"/>
          <img src={ScanQRcode} alt="scan" className="el-scan opacity0"/>
        </div>
        <div className="section scene2">
          <img src={Scene2Subway} alt="scene-2-subway" className="el-subway2 opacity0"/>
          <img src={Scene2Bus} alt="scene-2-bus" className="el-bus opacity0"/>
          <img src={Scene2Bike} alt="scene-2-bike" className="el-bike opacity0"/>
        </div>
        <div className="section scene3">
          <img src={Scene3Takeaway} alt="scene-3-takeaway" className="el-takeaway opacity0"/>
          <img src={Scene3Text} alt="scene-3-text" className="el-takeaway-text opacity0"/>
        </div>
        <div className="section scene4">
          <div className="subway-container">
            <img src={Scene4Subway} alt="scene-4-subway" className="el-subway3"/>
          </div>
        </div>
        <div className="section scene5">
          <img src={Scene5Hand} alt="scene-5-hand" className="el-hand opacity0"/>
        </div>
        <div className="section scene6">
          <img src={Scene6Hand} alt="scene-6-hand" className="el-hand2 opacity0"/>
        </div>
        <div className="section scene7">
          <img src={Letter} alt="scene-7-letter" className="el-letter opacity0"/>
          <img src={ConfrimBtn} alt="scene-7-btn" className="el-confirm opacity0"/>
          <div className="tag-container">
            <Slider speed={20}>
              <div className="tag-row margin-row">
                <img src={Tag} alt="tag" className="tag-item" onClick={this.handleClickTag}/>
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
              </div>
              <div className="tag-row">
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
              </div>
              <div className="tag-row margin-row">
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
                <img src={Tag} alt="tag" className="tag-item"/>
              </div>
            </Slider>
          </div>
        </div>
        <div className="section scene8">
          <div className="iyrics-container"></div>
        </div>
      </div>
    );
  }
}

export default App;
