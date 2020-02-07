import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { IAniFrame, animationGroup } from './config';
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

import { cubicBezier, stopWheel, animateCSS } from './utils';
import { Slider } from './components/slider/slide';

interface ITempCls {
  added: string[];
  removed: string[];
}

const delta = 100;
let H: number = 0;
const totalTime = 800;

let tid: NodeJS.Timeout | undefined;

const getCurrentBezierPoint = cubicBezier([0, 0], [0.0, 0], [0.0, 1], [1, 1]);
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

  // 歌曲名输入框的标志位, 用于处理中文输入法在部分设备的拼音字符问题
  private inputLock: boolean = false;
  // 保存用户选择的标签
  private selectTags: { [key: string]: boolean } = {};

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
    // 禁用浏览器滚动事件
    window.addEventListener('DOMMouseScroll', stopWheel, { passive: false });
    window.addEventListener('mousewheel', stopWheel, { passive: false });

    // 记录点击位置
    window.addEventListener('touchstart', this.setOriginPoint, false);

    // 监听滑动事件, 移动端没有 mousemove 事件
    window.addEventListener('touchmove', this.handleMouseMove,  { passive: false });

    window.addEventListener('touchend', this.clearPoint, false);

    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    window.removeEventListener('DOMMouseScroll', stopWheel);
    window.removeEventListener('mousewheel', stopWheel);

    window.removeEventListener('touchstart', this.setOriginPoint, false);
    window.removeEventListener('touchmove', this.handleMouseMove, false);
    window.removeEventListener('touchend', this.clearPoint, false);
  }

  handleMouseMove = (e: TouchEvent) => {
    if (!e.touches.length) return;
    const point = e.touches[0];
    if (!point.screenX || !point.screenY || tid) return;

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

  checkInputValid = (e: any) => {
    if (!this.inputLock) {
      if (e.target.value && e.target.value.length > 10) {
        alert('请勿超过十个字');
        e.target.value = e.target.value.slice(0,10);
        return false;
      }
    }
    return true;
  }

  interpolate(abs: number) {
    const scrollingElement = document.scrollingElement;
    if (tid || !H || !scrollingElement) return;
    const sTop = scrollingElement.scrollTop;
    const curTime = Date.now();

    tid = setInterval(() => {
      const t = Date.now();
      const diff = t - curTime;
      const percent = diff / totalTime;

      if (diff >= totalTime) {
        scrollingElement.scrollTop = sTop + H * abs;

        tid && clearInterval(tid);
        tid = undefined;

       // 清理工作
       cleanUpScene();
       this.transition();
      } else {
        const [x, y] = getCurrentBezierPoint(percent);
        scrollingElement.scrollTop = sTop + y * H * abs;
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

  touchConfirm = (flag: boolean) => {
    const node = document.querySelector('.el-confirm');
    if (flag) {
      node?.classList.add('touch');
    } else {
      node?.classList.remove('touch');
    }
  }

  handleClickTag = (e: any) => {
    const type = e.target.getAttribute('data-type');
    if (!type) return;
    const nodes = document.getElementsByClassName(`item-${type}`);
    for(let i = 0; i < nodes.length; i++) {
      const list = nodes[i].classList;
      if (list.contains('active')) {
        nodes[i].classList.remove('active');
        this.selectTags[`item-${type}`] = true;
      } else {
        nodes[i].classList.add('active');
        this.selectTags[`item-${type}`] = false;
      }
    }
  }

  compositeEnd = () => {
    console.log('comp end');
    if (this.inputLock) {
      this.inputLock = false;
      this.checkValid();
    }
  }

  compositeStart = () => {
    console.log('comp start');
    this.inputLock = true;
  }

  checkValid = () => {
    const input = document.querySelector('.song-input') as HTMLInputElement;
    if (input && input.value && input.value.length < 10) {
      return true;
    }
    alert('请勿超过十个字');
    input.value = input.value.slice(0,10);
    return false;
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
          <div className="el-confirm opacity0"
            onTouchStart={() => { this.touchConfirm(true); }}
            onTouchEnd={() => { this.touchConfirm(false); }}>
          </div>
          <div className="tag-container">
            <div className="input-container">
              <input type="text" className="song-input" placeholder="自定义歌曲名"
                onCompositionEnd={this.compositeEnd}
                onCompositionStart={this.compositeStart}
                onInput={this.checkInputValid}
              />
            </div>
            <Slider speed={20}>
              <div className="tag-row">
                <div className="tag-item item-a" onClick={this.handleClickTag} data-type="a" >爱拼才会赢</div>
                <div className="tag-item item-b" onClick={this.handleClickTag} data-type="b">未来不是梦</div>
                <div className="tag-item item-c" onClick={this.handleClickTag} data-type="c">我真的很不错</div>
                <div className="tag-item item-d" onClick={this.handleClickTag} data-type="d">壮志在我胸</div>
              </div>
              <div className="tag-row margin-row">
                <div className="tag-item item-e" onClick={this.handleClickTag} data-type="e">哈哈哈哈</div>
                <div className="tag-item item-f" onClick={this.handleClickTag} data-type="f">好嗨哟</div>
                <div className="tag-item item-g" onClick={this.handleClickTag} data-type="g">好嗨哟</div>
                <div className="tag-item item-h" onClick={this.handleClickTag} data-type="h">C位出道</div>
              </div>
              <div className="tag-row">
                <div className="tag-item item-i" onClick={this.handleClickTag} data-type="i">佛系少年</div>
                <div className="tag-item item-j" onClick={this.handleClickTag} data-type="j">葛优瘫</div>
                <div className="tag-item item-k" onClick={this.handleClickTag} data-type="k">断舍离</div>
                <div className="tag-item item-l" onClick={this.handleClickTag} data-type="l">神马都是浮云</div>
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
