# 项目交接说明

这份文档用于在另一台电脑、另一个模型会话、或者过一段时间后重新接手这个项目。

## 先看哪些文件

建议按下面顺序阅读：

1. `docs/project-handoff.md`
2. `docs/prompt-to-video.md`
3. `docs/templates/video-request-template.md`
4. `src/content/promiseLesson.ts`
5. `src/content/generated/promiseNarrationCues.ts`
6. `src/lesson-engine/LessonVideo.tsx`
7. `src/lesson-engine/timing.ts`
8. `scripts/generate-voiceover.ps1`
9. `scripts/generate-default-bgm.ps1`
10. `src/Root.tsx`

如果只想最快理解这套系统，前 5 个文件通常就够了。

## 这个项目现在已经能做什么

当前项目已经具备一条可复用的“文本驱动编程教学视频”流程：

- 用文本模板描述视频需求
- 将需求整理成结构化的 `LessonSpec`
- 用 Remotion 通用引擎渲染 scene
- 生成旁白音频
- 生成默认 BGM
- 用真实配音时间戳驱动字幕

目前已经做好的样板主题是：

- `PromiseLesson`

## 当前视频生成链路

整体链路如下：

`文本需求 -> LessonSpec -> 配音/BGM -> 字幕时间戳 -> Remotion 渲染 -> MP4`

对应的关键文件：

- 文本模板：`docs/templates/video-request-template.md`
- 样板内容：`src/content/promiseLesson.ts`
- 字幕时间戳：`src/content/generated/promiseNarrationCues.ts`
- 通用引擎：`src/lesson-engine/LessonVideo.tsx`
- 根入口：`src/Root.tsx`

## 如果换一台电脑继续做，需要什么

建议准备这些环境：

- Node.js
- npm
- Python 3

如果要生成配音，推荐安装到项目本地的 `edge-tts` 依赖目录：

```powershell
python -m pip install --target .pydeps edge-tts
```

这样不会依赖系统级 Python 权限。

## 第一次接手时推荐执行

```powershell
npm install
python -m pip install --target .pydeps edge-tts
```

如果系统临时目录权限有问题，执行 Remotion 命令前建议先设置工作区临时目录：

```powershell
$env:TEMP = (Join-Path (Get-Location) '.tmp')
$env:TMP = $env:TEMP
New-Item -ItemType Directory -Force -Path $env:TEMP | Out-Null
```

## 如何继续创作一个新主题

最推荐的方式不是直接手写 React 组件，而是复用当前流程：

1. 填写 `docs/templates/video-request-template.md`
2. 让模型先阅读：
   - `docs/project-handoff.md`
   - `docs/prompt-to-video.md`
   - `docs/templates/video-request-template.md`
   - `src/content/promiseLesson.ts`
   - `src/lesson-engine/LessonVideo.tsx`
3. 让模型仿照 `promiseLesson.ts` 新建一个内容文件
4. 生成新的配音与字幕时间戳
5. 在 `src/Root.tsx` 注册新的 composition
6. 预览并渲染

## 新模型接手时可以直接复制的话术

```txt
先阅读 docs/project-handoff.md、docs/prompt-to-video.md、docs/templates/video-request-template.md、src/content/promiseLesson.ts、src/lesson-engine/LessonVideo.tsx，然后按当前项目的视频生成流程继续帮我创作新视频。
```

如果还要让它直接实现新主题，可以再补一句：

```txt
请仿照 PromiseLesson 的结构，为新主题创建一个新的 lesson content 文件，并接入 Root.tsx。
```

## 当前项目里最重要的约定

### 1. 不再手写估算字幕秒数

现在字幕节奏已经改为：

- 先生成配音
- 再从配音生成真实句子时间戳
- 最后把时间戳转成 Remotion 字幕帧

因此，新主题不要再回到“手写 seconds 估算字幕”的旧方式。

### 2. 内容文件是主入口

每个新主题最核心的文件应该像这样：

- `src/content/<topic>Lesson.ts`

它负责定义：

- 视频元信息
- narrationScript
- scenes
- subtitles
- 音频资源路径

### 3. 通用渲染引擎尽量少改

如果只是新增主题，优先新增内容文件，而不是修改 `LessonVideo.tsx`。

只有在以下情况下才考虑改引擎：

- 现有 scene 类型不够用
- 需要新增新的视觉表达方式
- 音频 / 字幕 / 时间轴机制要升级

## 常用命令

安装依赖：

```powershell
npm install
```

生成配音：

```powershell
npm run audio:voice
```

生成默认 BGM：

```powershell
npm run audio:bgm
```

启动预览：

```powershell
npm run dev
```

渲染成片：

```powershell
npx remotion render src/index.ts PromiseLesson out/promise-lesson.mp4
```

运行测试：

```powershell
npm run test
```

## 已知情况

### 1. 全仓 lint / tsc 不是完全干净

仓库里原有的 `EventLoop` 和 `PrototypeChain` 目录存在历史遗留告警与报错。  
这不代表当前文本驱动视频管线有问题。

所以在接手时要区分：

- 当前新增的视频管线代码
- 仓库里原本就存在的问题

### 2. Remotion 依赖临时目录权限

如果系统 `Temp` 目录权限不稳定，Remotion bundling / render 可能失败。  
这种情况下，优先把 `TEMP` 和 `TMP` 指向项目下的 `.tmp`。

### 3. 配音依赖 `edge-tts`

推荐始终使用项目内的 `.pydeps` 安装方式，而不是依赖系统全局安装。

## 交接结论

以后如果要在另一台电脑继续创作，最稳的做法不是只让模型看一个文档，而是：

- 先看 `docs/project-handoff.md`
- 再看 `docs/prompt-to-video.md`
- 再看样板内容 `src/content/promiseLesson.ts`

这样模型既知道流程，也知道当前项目已经落地成什么样了。
