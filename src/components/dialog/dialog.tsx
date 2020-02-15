import React, { Component } from 'react';
import { IAniFrame, animationGroup } from '../../config';
import CoffeeText from '../../assets/coffee.png';
import ScanQRcode from '../../assets/scan.png';
import Subway from '../../assets/subway.png';

// import BgMobile from '../../assets/bg-mobile.png';
import Scene2Subway from '../../assets/subway-scene2.png';
import Scene2Bus from '../../assets/bus-scene2.png';
import Scene2Bike from '../../assets/bike-scene2.png';
// scene3
import Scene3Takeaway from '../../assets/takeaway-scene3.png';
import Scene3Text from '../../assets/text-scene3.png';
//scene 4
import Scene4Subway from '../../assets/subway-scene4.png';
// scene 5
import Scene5Hand from '../../assets/hand-scene5.png';
// scene 6
import Scene6Hand from '../../assets/hand-scene6.png';

import { cubicBezier, animateCSS, measureLeft, setElementStyle } from '../../utils';
import { Slider } from '../slider/slide';

import './dialog.css';

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

async function animate(config: IAniFrame) {
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
  const res = await animateCSS(config.selector, config.aniCls);
  if (res) {
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
  }
  // animateCSS(config.selector, config.aniCls, function() {
    
  // })
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

interface IDialogState {
  sectionId: number;
}

interface IDialogProps {
  setContentLoaded: () => void;
  isLoaded: boolean;
}

export default class DialogMain extends Component<IDialogProps, IDialogState> {

  // private sectionId: number = 0;
  private originX: number | null = 0;
  private originY: number | null = 0;

  // 歌曲名输入框的标志位, 用于处理中文输入法在部分设备的拼音字符问题
  private inputLock: boolean = false;
  // 保存用户选择的标签
  private selectTags: { [key: string]: boolean } = {};
  private selectType: string = '';

  // iOS端：记录focus时的 scrollTop 值
  private tempScrollTop: number | undefined;
  private scrollOffset: number | undefined;
  private focusLock: boolean = false;

  constructor(props: IDialogProps) {
    super(props);
    
    this.state = {
      sectionId: 0,
    };
  }

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
    // 记录点击位置
    document.addEventListener('touchstart', this.setOriginPoint);

    // 监听滑动事件, 移动端没有 mousemove 事件
    document.addEventListener('touchmove', this.handleMouseMove,  { passive: false });

    document.addEventListener('touchend', this.clearPoint);

    //利用捕获事件监听输入框等focus动作
    document.body.addEventListener("focus", this.handleInputFocus, true);

    window.addEventListener('scroll', this.handleWindowScroll);

    document.body.addEventListener('blur', this.handleInputBlur, true);

    // 阻止滚动时安卓浏览器发生的 resize 事件，避免导航栏工具栏消失
    window.addEventListener("resize", function(e) {
      console.log('resize');
      console.log(window.innerHeight);
      e.preventDefault();
    }, { capture: true, passive: true });

    window.onload = () => {
      console.log('load');
      this.props.setContentLoaded();
      // 将状态置为 loaded 之后父组件会把loading页none掉, 保证在none掉之后才复位scrollTop;
      setTimeout(() => {
        document.scrollingElement!.scrollTop = 0;
      }, 0);
    }

    // 动态设置 scene7 信纸容器的高度
    setTimeout(() => {
      const nodes = document.getElementsByClassName('letter-wrapper');
      if (nodes && nodes.length > 0) {
        let h = window.innerWidth * 1.71;
        if (h > window.innerHeight) {
          (nodes[0] as HTMLElement).style.height = `${window.innerHeight}px`;

          const imgW = window.innerHeight * (1269 / 2170);
          
          const tagContainer = document.querySelector('.tag-container') as HTMLElement;
          if (tagContainer) {
            tagContainer.style.width = `${imgW / window.innerWidth * 82.2}%`;
            tagContainer.style.fontSize = `${16 * (1269 / 2170)}px`;
          }


        } else {
          (nodes[0] as HTMLElement).style.height = `${h}px`;
        }
      }
    }, 100);

    // 计算背景图的缩放对一些元素百分比定位的影响
    const sc1Subway = measureLeft(0.212, 0.25);
    setElementStyle('.subway-container', {
      left: `${sc1Subway.left * 100}%`,
      top: `${sc1Subway.top * 100}%`,
    });
    const elSubway2 = measureLeft(0, 0.13);
    setElementStyle('.el-subway2', {
      left: `${elSubway2.left * 100}%`,
      top: `${elSubway2.top * 100}%`,
    });
    const sc3Bus = measureLeft(0.324, 0.292);
    setElementStyle('.el-bus', {
      left: `${sc3Bus.left * 100}%`,
      top: `${sc3Bus.top * 100}%`,
    }); 


    this.transition();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleWindowScroll);

    document.removeEventListener('touchstart', this.setOriginPoint);
    document.removeEventListener('touchmove', this.handleMouseMove);
    document.removeEventListener('touchend', this.clearPoint);

    document.body.removeEventListener("focus", this.handleInputFocus, true);
    document.body.removeEventListener('blur', this.handleInputBlur, true);
  }

  handleWindowScroll = () => {
    if (this.focusLock && this.tempScrollTop) {
      if (document.scrollingElement && document.scrollingElement.scrollTop !== this.tempScrollTop) {
        this.scrollOffset = document.scrollingElement.scrollTop - this.tempScrollTop;
      }
    }
  }

  handleInputFocus = () => {
    this.tempScrollTop = document.scrollingElement?.scrollTop;
    this.focusLock = true;
  }

  handleInputBlur = () => {
    this.focusLock = false;
    if (this.scrollOffset) {
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop -= this.scrollOffset;
      }
      this.scrollOffset = undefined;
    }
  }

  handleMouseMove = (e: TouchEvent) => {
    if (!this.props.isLoaded) return;

    e.preventDefault();

    if (!e.touches.length) return;
    const point = e.touches[0];
    if (!point.screenX || !point.screenY || tid || this.focusLock) return;

    if (this.originX && this.originY) {
      const deltaY = Math.abs(point.screenY - this.originY);
      if (deltaY > delta) {
        // true: 向上; false: 向下;
        const flag = this.originY > point.screenY;
        this.switchScene(flag);
        this.clearPoint();
      }
    }
  }

  async switchScene(dir: boolean) {
    const { sectionId } = this.state;
    if (dir) {
      console.log('sid: ', sectionId);
      if (sectionId >= 8) return;
      H = this.getSectionList()[sectionId].getBoundingClientRect().height;
      // 差值更新 document.scrollintElement.scrollTop
      await this.interpolate(1);

      this.setState({
        sectionId: sectionId + 1,
      });
      this.transition();
    } else {
      console.log('sid: ', sectionId);
      if (sectionId <= 0) return;
      H = this.getSectionList()[sectionId].getBoundingClientRect().height;
      await this.interpolate(-1);

      this.setState({
        sectionId: sectionId - 1,
      });
      this.transition();
    }
  }

  checkInputValid = (e: any) => {
    if (!this.inputLock) {
      if (e.target.value && e.target.value.length > 10) {
        alert('请勿超过十个字');
        e.target.value = e.target.value.slice(0,10);
        e.target.blur();
        return false;
      }
    }
    return true;
  }

  /**
   * 差值更新 scrollTop 模拟滚动
   * @param abs 正表示向下屏滚动；负表示向上屏滚动
   */
  interpolate(abs: number) {
    return new Promise((resolve, reject) => {
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
          // promise resolve
          resolve();
        } else {
          const [x, y] = getCurrentBezierPoint(percent);
          scrollingElement.scrollTop = sTop + y * H * abs;
        }
      }, 0);
    });
  }

  transition() {
    const { sectionId } = this.state;
    if (sectionId < 0 || sectionId > 8) return;
    const frames = animationGroup[sectionId];
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

  handleClickTag = (e: string) => {
    // const type = e.target.getAttribute('data-type');
    const type = e;
    if (!type) return;
    
    // 原本已选中一个tag, 先移除该选中态
    if (this.selectType && this.selectType !== type) {
      const nodes = document.getElementsByClassName(`item-${this.selectType}`);
      for(let i = 0; i < nodes.length; i++) {
        const list = nodes[i].classList;
        if (list.contains('active')) {
          nodes[i].classList.remove('active');
        }
      }
    }

    const nodes = document.getElementsByClassName(`item-${type}`);
    for(let i = 0; i < nodes.length; i++) {
      const list = nodes[i].classList;
      if (list.contains('active')) {
        nodes[i].classList.remove('active');
        // this.selectTags[`item-${type}`] = false;
        this.selectType = '';
      } else {
        nodes[i].classList.add('active');
        // this.selectTags[`item-${type}`] = true;
        this.selectType = type;
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
    input.blur();
    return false;
  }

  render() {
    const { sectionId } = this.state;

    return (
      <div className="dialog-main">
        <div className="section scene0">
          <div className="subway-container">
            <img src={Subway} alt="subway" className="el-subway"/>
          </div>
          <div className="intro1 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>又是新的一天，出门上班啦，阳光正好，路上人不少。</span>
              </div>
            </div>
          </div>
        </div>
        <div className="section scene1">
          <img src={CoffeeText} alt="coffee" className="el-coffee opacity0"/>
          <img src={ScanQRcode} alt="scan" className="el-scan opacity0"/>
          <div className="intro2 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>买早餐没带现金？移动支付更便利。咖啡和阳光更配哦~</span>
              </div>
            </div>
          </div>
        </div>
        <div className="section scene2">
          <img src={Scene2Subway} alt="scene-2-subway" className="el-subway2 opacity0"/>
          <img src={Scene2Bus} alt="scene-2-bus" className="el-bus opacity0"/>
          <img src={Scene2Bike} alt="scene-2-bike" className="el-bike opacity0"/>
          <div className="intro3 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>上班方式花样多，每天地铁公交小黄车轮着来。今天骑上小单车走咯~</span>
              </div>
            </div>
          </div> 
        </div>
        <div className="section scene3">
          <img src={Scene3Takeaway} alt="scene-3-takeaway" className="el-takeaway opacity0"/>
          <img src={Scene3Text} alt="scene-3-text" className="el-takeaway-text opacity0"/>
          <div className="intro4 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>公司午餐不发愁，外卖美食花样多。说曹操曹操到，我的外卖到啦~</span>
              </div>
            </div>
          </div> 
        </div>
        <div className="section scene4">
          <div className="subway-container">
            <img src={Scene4Subway} alt="scene-4-subway" className="el-subway3"/>
          </div>
          <div className="intro5 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>忙碌了一天踏上熟悉的回家路，晚上9点半的星光，闪烁的是梦想和奋斗的光芒~</span>
              </div>
            </div>
          </div> 
        </div>
        <div className="section scene5">
          <img src={Scene5Hand} alt="scene-5-hand" className="el-hand opacity0"/>
          <div className="intro6 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>城市方便你我他，守护城市靠大家。垃圾分类成习惯，今天你分类了吗~</span>
              </div>
            </div>
          </div> 
        </div>
        <div className="section scene6">
          <img src={Scene6Hand} alt="scene-6-hand" className="el-hand2 opacity0"/>
          <div className="intro7 pt-1rem pl-1rem pr-1rem opacity0">
            <div className="textarea">
              <div className="abs-wrapper">
                <span>买东西不出门，网上下单隔天就到，取个快递回家啦，让我看看到了啥？</span>
              </div>
            </div>
          </div> 
        </div>
        <div className="section scene7">
          <div className="letter-wrapper opacity0">
            <div className="tag-container">
              <div className="input-container">
                <input type="text" className="song-input" placeholder="自定义歌曲名"
                  onCompositionEnd={this.compositeEnd}
                  onCompositionStart={this.compositeStart}
                  onInput={this.checkInputValid}
                  // onFocus={}
                />
              </div>
              {sectionId === 7 && (
                <Slider speed={40}>
                  <div className="slide-content">
                    <div className="tag-row">
                      <div className="tag-item item-a" onClick={() => { this.handleClickTag('a'); }}>
                        <span>爱拼才会赢</span>
                      </div>
                      <div className="tag-item item-b" onClick={() => { this.handleClickTag('b'); }}>
                        <span>未来不是梦</span>
                      </div>
                      <div className="tag-item item-c" onClick={() => { this.handleClickTag('c'); }}>
                        <span>我真的很不错</span>
                      </div>
                      <div className="tag-item item-d" onClick={() => { this.handleClickTag('d'); }}>
                        <span>壮志在我胸</span>
                      </div>
                    </div>
                    <div className="tag-row margin-row">
                      <div className="tag-item item-e" onClick={() => { this.handleClickTag('e'); }}>
                        <span>哈哈哈哈</span>
                      </div>
                      <div className="tag-item item-f" onClick={() => { this.handleClickTag('f'); }}>
                        <span>好嗨哟</span>
                      </div>
                      <div className="tag-item item-g" onClick={() => { this.handleClickTag('g'); }}>
                        <span>小幸运</span>
                      </div>
                      <div className="tag-item item-h" onClick={() => { this.handleClickTag('h'); }}>
                        <span>C位出道</span>
                      </div>
                    </div>
                    <div className="tag-row">
                      <div className="tag-item item-i" onClick={() => { this.handleClickTag('i'); }}>
                        <span>佛系少年</span>
                      </div>
                      <div className="tag-item item-j" onClick={() => { this.handleClickTag('j'); }}>
                        <span>葛优瘫</span>
                      </div>
                      <div className="tag-item item-k" onClick={() => { this.handleClickTag('k'); }}>
                        <span>断舍离</span>
                      </div>
                      <div className="tag-item item-l" onClick={() => { this.handleClickTag('l'); }}>
                        <span>神马都是浮云</span>
                      </div>
                    </div>
                  </div>
                </Slider>
              )}
            </div>
          </div>
          <div className="el-confirm opacity0"
            onTouchStart={() => { this.touchConfirm(true); }}
            onTouchEnd={() => { this.touchConfirm(false); }}>
          </div>
        </div>
        <div className="section scene8">
          <div className="iyrics-container"></div>
        </div>
      </div>
    );
  }
}