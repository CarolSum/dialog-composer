import React from 'react';
import './App.css';
import { stopWheel } from './utils';
import DialogMain from './components/dialog/dialog';
import LoadingGif from './assets/loading.gif';

import Music1 from './assets/music/music1.wav';
import Music2_1 from './assets/music/music2-1.mp3';
import Music2_2 from './assets/music/music2-2.mp3';
import Music3 from './assets/music/music3.wav';
import Music4 from './assets/music/music4.wav';
import Music6 from './assets/music/music6.wav';
import Music7 from './assets/music/music7.mp3';
import Music8 from './assets/music/music8.mp3';

interface IAppState {
  isMobile?: boolean;
  isLoaded: boolean;
}
// const DialogMain = React.lazy(() => import('./components/dialog/dialog'));

class App extends React.Component<{}, IAppState> {

  constructor(props: {}) {
    super(props);
    let isMobile = true;
    isMobile = /(iPhone|iPad|iPod|iOS|Android|SymbianOS|webOS)/i.test(navigator.userAgent);
    
    this.state = {
      isMobile,
      isLoaded: false,
    };
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';

    // 禁用浏览器滚动事件
    window.addEventListener('DOMMouseScroll', stopWheel, { passive: false });
    window.addEventListener('mousewheel', stopWheel, { passive: false });

    // 阻止滚动时安卓浏览器发生的 resize 事件，避免导航栏工具栏消失
    window.addEventListener("resize", function(e) {
      console.log('resize');
      console.log(window.innerHeight);
      e.preventDefault();
    }, { capture: true, passive: true });

  }

  componentWillUnmount() {
    window.removeEventListener('DOMMouseScroll', stopWheel);
    window.removeEventListener('mousewheel', stopWheel);
  }

  setLoaded = () => {
    console.log('setLoaded');
    this.setState({
      isLoaded: true,
    });
  }
  
  getContent() {
    const { isMobile, isLoaded } = this.state;

    const loadingClass = `loading-bg loading ${isLoaded ? 'none' : ''}`;
    const dialogCls = `${isLoaded ? 'visible' : 'hidden'}`;

    if (!isMobile) {
      return (
        <div className="loading">
          不支持PC端浏览，请在手机端打开该页面
        </div>
      );
    }
    else {
      return (
        <div>
          <div className={loadingClass}>
            <img src={LoadingGif} alt="loading gif"/>
          </div>
          <div className={dialogCls}>
            <DialogMain setContentLoaded={this.setLoaded} isLoaded={isLoaded}/>
          </div>
          <audio src={Music1} id="music1" preload="auto"></audio>
          <audio src={Music2_1} id="music2_1" preload="auto"></audio>
          <audio src={Music2_2} id="music2_2" preload="auto"></audio>
          <audio src={Music3} id="music3" preload="auto"></audio>
          <audio src={Music4} id="music4" preload="auto"></audio>
          <audio src={Music6} id="music6" preload="auto"></audio>
          <audio src={Music7} id="music7" preload="auto"></audio>
          <audio src={Music8} id="music8" preload="auto"></audio>
        </div>
      )
    }
  }

  render() {
    const content = this.getContent();
    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
