# 文本到视频工作流

这个项目现在支持一种稳定的“文本驱动视频”流程：

1. 用模板整理视频需求
2. 让 Codex 把需求转换成 `LessonSpec`
3. 生成配音和默认 BGM
4. 在 Remotion Studio 预览
5. 渲染最终视频

## 1. 填写需求模板

先复制 `docs/templates/video-request-template.md`，填写你的主题、受众、时长和必讲点。

## 2. 让 Codex 生成 lesson spec

把填写后的文本直接发给 Codex。  
Codex 会把它整理成类似 `src/content/promiseLesson.ts` 这样的结构化内容文件。

建议让 Codex 一并产出：

- 讲稿
- 字幕分段
- 分镜
- scene 配置
- 音频路径

## 3. 生成音频

### 配音

优先方案是使用免费 `edge-tts`：

```powershell
python -m pip install --target .pydeps edge-tts
```

然后把讲稿写入 `tmp/narration.txt`：

```powershell
New-Item -ItemType Directory -Force tmp | Out-Null
Set-Content tmp\narration.txt "<把 lesson spec 的 narrationScript 粘进来>" -Encoding UTF8
npm run audio:voice
```

默认会生成：

- `public/audio/promise-narration.mp3`

### 默认 BGM

```powershell
npm run audio:bgm
```

默认会生成：

- `public/audio/default-bgm.wav`

## 4. 预览

```powershell
npm run dev
```

打开 Remotion Studio 后，选择 `PromiseLesson` 或你新增的 composition。

重点检查：

- 字幕是否和旁白节奏大致一致
- BGM 是否不会压过旁白
- scene 切换是否顺畅
- 代码高亮和讲解是否同步

## 5. 渲染最终视频

```powershell
npx remotion render src/index.ts PromiseLesson out/promise-lesson.mp4
```

如果你新增了其他主题，把 `PromiseLesson` 换成对应 composition id 即可。

## Handoff

如果你是在另一台电脑、另一个模型会话、或者隔一段时间后重新接手本项目，建议先阅读：

- `docs/project-handoff.md`
