import React from 'react';
import './App.css';
import { stopWheel } from './utils';

interface IAppState {
  isMobile?: boolean;
}
const DialogMain = React.lazy(() => import('./components/dialog/dialog'));

class App extends React.Component<{}, IAppState> {

  constructor(props: {}) {
    super(props);
    let isMobile = true;
    isMobile = /(iPhone|iPad|iPod|iOS|Android|SymbianOS|webOS)/i.test(navigator.userAgent);
    
    this.state = {
      isMobile,
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
  
  render() {
    const { isMobile } = this.state;

    return (
      <div className="App">
        {!isMobile && (
          <div
            style={{
              width: '100%',
              height: '100vh',
              lineHeight: '100vh',
              textAlign: 'center',
            }}
          >
            不支持PC端浏览，请在手机端打开该页面
          </div>
        )}
        {isMobile && (
          <React.Suspense fallback={(
            <div className="loading">
              Loading...
            </div>
          )}>
            <DialogMain />
          </React.Suspense>
        )}
      </div>
    );
  }
}

export default App;
