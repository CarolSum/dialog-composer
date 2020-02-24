import React from 'react';
import './App.css';
import { stopWheel, AudioController } from './utils';
import DialogMain from './components/dialog/dialog';
import LoadingGif from './assets/loading.gif';

import MusicBg from './assets/music/bg-music.mp3';
import Music1 from './assets/music/music1.wav';
import Music2_1 from './assets/music/music2-1.mp3';
import Music2_2 from './assets/music/music2-2.mp3';
import Music3 from './assets/music/music3.mp3';
import Music4 from './assets/music/music4.mp3';
import Music6 from './assets/music/music6.mp3';
import Music7 from './assets/music/music7.mp3';
import Music8 from './assets/music/music8.mp3';
import MusicOn from './assets/music_on.svg';
import MusicOff from './assets/music_off.svg';

interface IAppState {
  isMobile?: boolean;
  isLoaded: boolean;
  isBGMPlayed: boolean;
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
      isBGMPlayed: false,
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

    AudioController.load();
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

  setBgState = (played: boolean) => {
    this.setState({
      isBGMPlayed: played,
    });
  }

  toggleBGM = () => {
    const { isBGMPlayed } = this.state;
    try {
      const node = document.querySelector('#music_bg') as HTMLMediaElement;
      if (node.paused) {
        node.play();
      } else {
        node.pause();
      }
      this.setState({
        isBGMPlayed: !isBGMPlayed,
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  getContent() {
    const { isMobile, isLoaded, isBGMPlayed } = this.state;

    const loadingClass = `loading-bg loading ${isLoaded ? 'none' : ''}`;
    const dialogCls = `${isLoaded ? 'visible' : 'hidden'}`;
    const bgmSwitcherCls = `${isBGMPlayed ? 'music-on' : 'music-off'}`;

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
            <DialogMain setContentLoaded={this.setLoaded} isLoaded={isLoaded} setBGMState={this.setBgState}/>
          </div>
          <div id="bgm-switcher" className={bgmSwitcherCls} onClick={this.toggleBGM}>
            {isBGMPlayed && <MusicOn />}
            {!isBGMPlayed && <MusicOff />}
          </div>
          <audio src={MusicBg} id="music_bg" preload="auto" loop={true}></audio>
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
