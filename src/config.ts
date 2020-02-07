// 动画帧 interface
export interface IAniFrame {
  selector: string;
  aniCls: string[];
  addAfterAnimation: string[];
  removeBeforeAnimation: string[];
  children?: IAniFrame[];
}

// 定义每个场景中的动画组
export const animationGroup: IAniFrame[][] = [
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