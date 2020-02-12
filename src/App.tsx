import React from 'react';
import './App.css';
import { stopWheel } from './utils';
import DialogMain from './components/dialog/dialog';
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
            Loading...
          </div>
          <div className={dialogCls}>
            <DialogMain setContentLoaded={this.setLoaded} isLoaded={isLoaded}/>
          </div>
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
