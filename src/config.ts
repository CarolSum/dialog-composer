import { AudioController } from "./utils"

// 动画帧 interface
export interface IAniFrame {
  selector: string;
  aniCls: string[];
  addAfterAnimation: string[];
  removeBeforeAnimation: string[];
  children?: IAniFrame[];
  callbefore?: () => void;
  callback?: () => void;
}

// 定义每个场景中的动画组
export const animationGroup: IAniFrame[][] = [
  [
    {
      selector: '.el-indicator',
      aniCls: ['flash', 'infinite'],
      addAfterAnimation: [],
      removeBeforeAnimation: [],
    }
  ],
  // scene 0
  [
    {
      selector: '.el-subway',
      aniCls: ['lr-circle', 'infinite'],
      addAfterAnimation: [],
      removeBeforeAnimation: [],
      callbefore: function () {
        AudioController.play('#music1');
      }
    },
    {
      selector: '.intro1',
      aniCls: ['fadeIn'],
      addAfterAnimation: ['opacity1'],
      removeBeforeAnimation: ['opacity0']
    }
  ],
  // scene 1
  [
    {
      selector: '.el-coffee',
      aniCls: ['fadeIn'],
      addAfterAnimation: ['opacity1'],  // 动画结束后添加的样式类，用于覆盖原来的样式
      removeBeforeAnimation: [],  // 动画开始前添加的样式类
      callbefore: () => {
        AudioController.play('#music2_1');
      },
      // 子动画组
      children: [
        {
          selector: '.el-scan',
          removeBeforeAnimation: ['opacity0'],
          aniCls: ['slideInUp'],
          addAfterAnimation: ['opacity1'],  // 动画结束后添加的样式类，用于覆盖原来的样式
          callbefore: () => {
            AudioController.play('#music2_2');
          },
          children: [
            {
              selector: '.intro2',
              aniCls: ['fadeIn'],
              addAfterAnimation: ['opacity1'],
              removeBeforeAnimation: ['opacity0'] 
            }
          ]
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
      removeBeforeAnimation: ['opacity0'],
      callbefore: () => {
        AudioController.play('#music3');
      },
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
          children: [
            {
              selector: '.intro3',
              aniCls: ['fadeIn'],
              addAfterAnimation: ['opacity1'],
              removeBeforeAnimation: ['opacity0'] 
            }
          ]
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
      callbefore: () => {
        AudioController.play('#music4');
      },
      children: [
        {
          selector: '.el-takeaway-text',
          aniCls: ['fadeIn'],
          addAfterAnimation: ['opacity1'],
          removeBeforeAnimation: ['opacity0'],
          children: [
            {
              selector: '.intro4',
              aniCls: ['fadeIn'],
              addAfterAnimation: ['opacity1'],
              removeBeforeAnimation: ['opacity0'] 
            },
          ]
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
      callbefore: () => {
        AudioController.play('#music1');
      }
    },
    {
      selector: '.intro5',
      aniCls: ['fadeIn'],
      addAfterAnimation: ['opacity1'],
      removeBeforeAnimation: ['opacity0'] 
    },
  ],
  // scene 5
  [
    {
      selector: '.el-hand',
      aniCls: ['slideInUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
      callback: () => {
        AudioController.play('#music6');
      },
      children: [
        {
          selector: '.intro6',
          aniCls: ['fadeIn'],
          addAfterAnimation: ['opacity1'],
          removeBeforeAnimation: ['opacity0']  
        } 
      ]
    }
  ],
  // scene 6
  [
    {
      selector: '.el-hand2',
      aniCls: ['slideInCenterUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
      callback: () => {
        AudioController.play('#music7');
      },
      children: [
        {
          selector: '.intro7',
          aniCls: ['fadeIn'],
          addAfterAnimation: ['opacity1'],
          removeBeforeAnimation: ['opacity0']  
        },
      ]
    }
  ],
  // scene 7
  [
    {
      selector: '.letter-wrapper',
      aniCls: ['rotateUp'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity1'],
      callbefore: () => {
        AudioController.play('#music8');
      },
      children: [
        {
          selector: '.el-confirm',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        }
      ]
    },
  ],
  // scene 8
  [
    {
      selector: '.lyrics-wrapper',
      aniCls: ['lyrics-showup'],
      removeBeforeAnimation: ['opacity0'],
      addAfterAnimation: ['opacity08'],
      children: [
        {
          selector: '.d-title',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        },
        {
          selector: '.iyrics-container',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        },
        {
          selector: '.d-func-btns',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        },
        {
          selector: '.d-save-btn',
          aniCls: ['fadeIn'],
          removeBeforeAnimation: ['opacity0'],
          addAfterAnimation: ['opacity1'],
        },
      ]
    }
  ]
]