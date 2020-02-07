import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import VConsole from 'vconsole';
import { setDocHeight } from './utils';

window.addEventListener('resize', function () {
  setDocHeight();
});
window.addEventListener('orientationchange', function () {
  setDocHeight();
});
setDocHeight();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const vConsole = new VConsole();
ReactDOM.render(<App />, document.getElementById('root'));

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <NextApp/>,
      document.getElementById('root')
    );
  });
}

// setInterval(() => {
//   document.scrollingElement!.scrollTop += window.innerHeight;
// }, 1000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
