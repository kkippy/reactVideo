import {
  buildSubtitleTrackFromTimedCues,
  secondsToFrames,
} from '../lesson-engine/timing';
import type {LessonSpec} from '../lesson-engine/types';
import {narrationTimedCues} from './generated/promiseNarrationCues';

const fps = 30;

const narrationSegments = [
  {seconds: 6, text: '很多人第一次学 Promise，会先背一堆名词。'},
  {seconds: 6, text: '但先别急着背定义，我们先看它到底在解决什么问题。'},

  {
    seconds: 10,
    text: '如果没有 Promise，处理异步结果最常见的方式，就是把回调函数一层一层传进去。',
  },
  {
    seconds: 10,
    text: '回调一多，代码会越来越往右缩，阅读和修改都会变得吃力。',
  },
  {
    seconds: 12,
    text: '更麻烦的是，成功逻辑和失败逻辑会散在不同位置，你很难一眼看出这段异步流程到底什么时候结束。',
  },

  {seconds: 10, text: 'Promise 可以先把未来的结果包装起来。'},
  {seconds: 12, text: '结果还没回来时，它是 pending，也就是等待中。'},
  {
    seconds: 10,
    text: '一旦拿到成功结果，它会变成 fulfilled；如果出错，就会变成 rejected。',
  },

  {
    seconds: 10,
    text: '这三个状态里，最重要的不是名字，而是状态只能从等待中走向成功或失败。',
  },
  {
    seconds: 14,
    text: '一旦状态改变，就不会再回头。这一点很关键，因为它让异步结果变得可预测。',
  },
  {
    seconds: 16,
    text: '你不需要担心同一个 Promise 一会成功一会失败，后续逻辑也就可以稳定地写在 then 或 catch 里。',
  },

  {
    seconds: 12,
    text: '来看一个最小例子。创建 Promise 时，会立刻执行传进去的那个函数。',
  },
  {seconds: 14, text: '如果异步任务成功，就调用 resolve，把结果交出去。'},
  {seconds: 12, text: '如果任务失败，就调用 reject，把错误交出去。'},

  {seconds: 12, text: 'then 用来接住成功结果，catch 用来接住失败结果。'},
  {seconds: 14, text: 'finally 不关心成功还是失败，它更像一个统一的收尾动作。'},
  {
    seconds: 16,
    text: '所以你可以把 Promise 想成：先拿到一个未来结果的占位符，再安排成功、失败和收尾时要做什么。',
  },

  {
    seconds: 10,
    text: 'Promise 另一个很大的好处，是 then 还可以继续返回一个新的 Promise。',
  },
  {seconds: 12, text: '这样异步步骤就能按顺序排开，而不是一层层嵌套进去。'},
  {
    seconds: 12,
    text: '代码不一定更短，但流程会更直，也更容易把错误统一交给最后的 catch。',
  },

  {
    seconds: 10,
    text: '初学者常见的一个坑，是在 then 里开启了新的异步，却忘了 return。',
  },
  {seconds: 12, text: '一旦没有 return，后面的 then 就接不到新的结果。'},
  {
    seconds: 10,
    text: '所以你可以记一句话：链式调用里，想把结果继续传下去，就要 return。',
  },

  {seconds: 6, text: '最后只记住三件事。'},
  {seconds: 6, text: 'Promise 用来表示未来结果。'},
  {
    seconds: 6,
    text: '状态一旦改变不可逆，then 和 catch 让异步流程更清晰。',
  },
];

const duration = (seconds: number) => secondsToFrames(seconds, fps);

const narrationScript = narrationSegments.map((segment) => segment.text).join('\n');

export const promiseLessonSpec: LessonSpec = {
  meta: {
    id: 'promise-basic',
    title: 'Promise 入门',
    topic: 'Promise',
    audience: '前端初学者',
    fps,
    width: 1920,
    height: 1080,
  },
  audio: {
    narrationScript,
    narrationSrc: '/audio/promise-narration.mp3',
    bgmSrc: '/audio/default-bgm.wav',
    bgmVolume: 0.14,
  },
  scenes: [
    {
      type: 'title',
      durationInFrames: duration(12),
      title: 'Promise 入门',
      subtitle: '先搞懂它解决什么问题，再看它怎么用。',
    },
    {
      type: 'bullet',
      durationInFrames: duration(32),
      heading: '为什么会觉得异步难写？',
      emphasis: '先看问题，再背定义',
      bullets: [
        '回调层层嵌套，代码越来越往右缩',
        '成功和失败逻辑分散，不好一眼看懂',
        '异步流程什么时候真正结束，不够直观',
      ],
    },
    {
      type: 'bullet',
      durationInFrames: duration(32),
      heading: 'Promise 到底是什么？',
      emphasis: '它更像“未来结果的包装盒”',
      bullets: [
        '任务还没完成时，先拿到一个统一对象',
        '以后成功还是失败，都从这个对象继续往下处理',
        '把异步结果的表达方式统一起来',
      ],
    },
    {
      type: 'flow',
      durationInFrames: duration(40),
      heading: '三种状态',
      steps: ['pending', 'fulfilled', 'rejected'],
      stateLabels: ['等待中', '已完成并成功', '已完成但失败'],
    },
    {
      type: 'code',
      durationInFrames: duration(38),
      heading: '创建 Promise：resolve / reject',
      code: `const result = new Promise((resolve, reject) => {
  setTimeout(() => {
    const ok = true;

    if (ok) {
      resolve('请求成功');
      return;
    }

    reject(new Error('请求失败'));
  }, 1000);
});`,
      highlights: [
        {startLine: 1, endLine: 1, label: '创建 Promise 时，传入一个执行函数'},
        {startLine: 6, endLine: 7, label: '成功时调用 resolve，交出结果'},
        {startLine: 10, endLine: 10, label: '失败时调用 reject，交出错误'},
      ],
    },
    {
      type: 'code',
      durationInFrames: duration(42),
      heading: 'then / catch / finally',
      code: `result
  .then((value) => {
    console.log('成功：', value);
    return value.length;
  })
  .catch((error) => {
    console.log('失败：', error.message);
    return 0;
  })
  .finally(() => {
    console.log('收尾动作');
  });`,
      highlights: [
        {startLine: 2, endLine: 4, label: 'then 处理成功结果，并且还能 return 新值'},
        {startLine: 6, endLine: 8, label: 'catch 统一接住错误'},
        {startLine: 10, endLine: 12, label: 'finally 不关心结果，只负责收尾'},
      ],
    },
    {
      type: 'flow',
      durationInFrames: duration(34),
      heading: '链式调用为什么更清晰？',
      steps: ['拿到结果', '继续处理', '返回下一个 Promise', '统一兜底 catch'],
      stateLabels: [
        '先接住上一步的结果',
        '在 then 里做加工',
        '把新结果继续传下去',
        '最后集中处理错误',
      ],
    },
    {
      type: 'bullet',
      durationInFrames: duration(32),
      heading: '一个常见坑：忘记 return',
      emphasis: '链路想继续，结果就要 return',
      bullets: [
        '在 then 里开启新异步，却没有把它 return 出去',
        '后面的 then 拿不到新结果，只能收到 undefined',
        '想让链式调用接力下去，就显式 return',
      ],
    },
    {
      type: 'summary',
      durationInFrames: duration(18),
      heading: '最后记住这三点',
      takeaways: [
        'Promise 用来表示“未来才会得到的结果”',
        '状态一旦改变，就不会再回头',
        'then / catch 让异步流程更清晰，return 决定链路能不能接下去',
      ],
    },
  ],
  subtitles: buildSubtitleTrackFromTimedCues(narrationTimedCues, fps, 4),
};

export const promiseLessonDurationInFrames = promiseLessonSpec.scenes.reduce(
  (sum, scene) => sum + scene.durationInFrames,
  0,
);
