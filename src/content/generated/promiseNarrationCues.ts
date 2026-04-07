export const narrationTimedCues = [
  {
    "startMs": 100,
    "endMs": 4175,
    "text": "很多人第一次学 Promise，会先背一堆名词。"
  },
  {
    "startMs": 4125,
    "endMs": 9350,
    "text": "但先别急着背定义，我们先看它到底在解决什么问题。"
  },
  {
    "startMs": 9350,
    "endMs": 16762,
    "text": "如果没有 Promise，处理异步结果最常见的方式，就是把回调函数一层一层传进去。"
  },
  {
    "startMs": 16762,
    "endMs": 22662,
    "text": "回调一多，代码会越来越往右缩，阅读和修改都会变得吃力。"
  },
  {
    "startMs": 22662,
    "endMs": 31988,
    "text": "更麻烦的是，成功逻辑和失败逻辑会散在不同位置，你很难一眼看出这段异步流程到底什么时候结束。"
  },
  {
    "startMs": 31988,
    "endMs": 35562,
    "text": "Promise 可以先把未来的结果包装起来。"
  },
  {
    "startMs": 35562,
    "endMs": 39925,
    "text": "结果还没回来时，它是 pending，也就是等待中。"
  },
  {
    "startMs": 39925,
    "endMs": 47088,
    "text": "一旦拿到成功结果，它会变成 fulfilled；如果出错，就会变成 rejected。"
  },
  {
    "startMs": 47088,
    "endMs": 54550,
    "text": "这三个状态里，最重要的不是名字，而是状态只能从等待中走向成功或失败。"
  },
  {
    "startMs": 54550,
    "endMs": 57788,
    "text": "一旦状态改变，就不会再回头。"
  },
  {
    "startMs": 57788,
    "endMs": 62288,
    "text": "这一点很关键，因为它让异步结果变得可预测。"
  },
  {
    "startMs": 62288,
    "endMs": 70575,
    "text": "你不需要担心同一个 Promise 一会成功一会失败，后续逻辑也就可以稳定地写在 then 或 catch 里。"
  },
  {
    "startMs": 70575,
    "endMs": 72638,
    "text": "来看一个最小例子。"
  },
  {
    "startMs": 72638,
    "endMs": 77200,
    "text": "创建 Promise 时，会立刻执行传进去的那个函数。"
  },
  {
    "startMs": 77200,
    "endMs": 81762,
    "text": "如果异步任务成功，就调用 resolve，把结果交出去。"
  },
  {
    "startMs": 81762,
    "endMs": 86162,
    "text": "如果任务失败，就调用 reject，把错误交出去。"
  },
  {
    "startMs": 86162,
    "endMs": 90988,
    "text": "then 用来接住成功结果，catch 用来接住失败结果。"
  },
  {
    "startMs": 90988,
    "endMs": 96525,
    "text": "finally 不关心成功还是失败，它更像一个统一的收尾动作。"
  },
  {
    "startMs": 96525,
    "endMs": 105650,
    "text": "所以你可以把 Promise 想成：先拿到一个未来结果的占位符，再安排成功、失败和收尾时要做什么。"
  },
  {
    "startMs": 105650,
    "endMs": 111850,
    "text": "Promise 另一个很大的好处，是 then 还可以继续返回一个新的 Promise。"
  },
  {
    "startMs": 111850,
    "endMs": 117075,
    "text": "这样异步步骤就能按顺序排开，而不是一层层嵌套进去。"
  },
  {
    "startMs": 117075,
    "endMs": 123650,
    "text": "代码不一定更短，但流程会更直，也更容易把错误统一交给最后的 catch。"
  },
  {
    "startMs": 123650,
    "endMs": 129588,
    "text": "初学者常见的一个坑，是在 then 里开启了新的异步，却忘了 return。"
  },
  {
    "startMs": 129588,
    "endMs": 133850,
    "text": "一旦没有 return，后面的 then 就接不到新的结果。"
  },
  {
    "startMs": 133850,
    "endMs": 140412,
    "text": "所以你可以记一句话：链式调用里，想把结果继续传下去，就要 return。"
  },
  {
    "startMs": 140412,
    "endMs": 142788,
    "text": "最后只记住三件事。"
  },
  {
    "startMs": 142788,
    "endMs": 145650,
    "text": "Promise 用来表示未来结果。"
  },
  {
    "startMs": 145650,
    "endMs": 150738,
    "text": "状态一旦改变不可逆，then 和 catch 让异步流程更清晰。"
  }
] as const;
