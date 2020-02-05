import { Component } from "react";
import React from "react";
import './slide.css';

interface ISliderProps {
  speed: number,
}

interface ISliderState {
  wrapper: HTMLDivElement | null;
  contentRef: HTMLDivElement | null;
  copyRef: HTMLDivElement | null;
}

export class Slider extends Component<ISliderProps, ISliderState> {

  private timer: NodeJS.Timeout | null;

  private touchX: number = 0;
  private oldScrollLeft: number | undefined;

  static defaultProps = {
    speed: 100
  }

  constructor(props: ISliderProps) {
    super(props);
    this.timer = null;
    this.state = {
      wrapper: null,
      contentRef: null,
      copyRef: null
    };
  }

  setWrapperRef = (el: HTMLDivElement) => {
    this.setState({
      wrapper: el,
    });
  }

  setContentRef = (el: HTMLDivElement) => {
    this.setState({
      contentRef: el,
    });
  }

  setCopyRef = (el: HTMLDivElement) => {
    this.setState({
      copyRef: el,
    });
  }

  marquee = () => {
    const { wrapper, contentRef, copyRef } = this.state;
    if (!wrapper || !contentRef || !copyRef) return;

    if (copyRef.offsetWidth === wrapper.scrollLeft) {
      wrapper.scrollLeft -= contentRef.offsetWidth;
    }
    wrapper.scrollLeft++;
  }

  onStart = (speed?: number) => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.marquee, speed || this.props.speed);
  }

  onStop = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = null;
  }

  componentDidUpdate() {
    console.log('will update');
    this.updateWrapperSize();
  }

  componentWillReceiveProps(nextProps: ISliderProps) {
    if (this.props.speed !== nextProps.speed) {
      this.onStart(nextProps.speed);
    }
  }

  updateWrapperSize= () => {
    const { contentRef, copyRef, wrapper } = this.state;
    
    if (contentRef && copyRef && wrapper) {
      // setTimeout 确保dom已经渲染完成
      setTimeout(() => {
        wrapper.style.height = contentRef.offsetHeight + 'px';
        // console.log(contentRef.offsetWidth);
        // console.log(contentRef.scrollWidth);
        wrapper.style.width = contentRef.scrollWidth + 'px';
        // console.log(contentRef.offsetWidth);
        // console.log(contentRef.scrollWidth);
        // wrapper.style.width = contentRef.scrollWidth + 'px';
        this.onStart(); 
      }, 500);
    }
  }


  componentWillUnmount() {
    this.onStop();
  }

  onDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log('start', e);
    const { pageX, pageY } = e.touches[0];
    console.log(pageX, pageY);
    this.onStop();

    this.oldScrollLeft = this.state.wrapper?.scrollLeft;
    this.touchX = pageX;
  }

  onDragEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log('end', e);
    const {clientX, clientY} = e.changedTouches[0];
    console.log(clientX, clientY);
    this.onStart();
    this.oldScrollLeft = undefined;
    this.touchX = 0;
  }

  onDrag = (e: React.TouchEvent<HTMLDivElement>) => {

    const { contentRef, wrapper } = this.state;
    console.log('drag: ', e);
    const {pageX, pageY} = e.touches[0];
    console.log(pageX, pageY);

    const distance = pageX - this.touchX;
    let temp = (this.oldScrollLeft || 0) - distance;
    temp %= contentRef!.offsetWidth;

    // 如果 scrollLeft 将要小于0, 浏览器最终会使其变为0, 导致在某些情况下滑不动, 像是卡住
    // 这里通过把位置更新为对称点来衔接
    if (temp < 0) {
      temp = contentRef!.offsetWidth + temp;
    }

    wrapper!.scrollLeft = temp;
  }

  render() {
    const { children } = this.props;
    return (
      <div
        onTouchStart={this.onDragStart}
        onTouchMove={this.onDrag}
        onTouchEnd={this.onDragEnd}
        style={{
          overflow: 'hidden',
        }}
      >
        <div ref={this.setWrapperRef} className="slider-wrapper">
          <div ref={this.setContentRef} className="slider-content">
            {children}
          </div>
          <div ref={this.setCopyRef} className="slider-content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}