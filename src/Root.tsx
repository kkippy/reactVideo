import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { PrototypeChainVideo } from "./PrototypeChain";
import { MainScene } from "./PrototypeChain/MainScene";
import { PrototypeJump } from "./PrototypeChain/PrototypeJump";
import { Main } from "./PrototypeChain/Main";
import { Main as EventLoopMain } from "./EventLoop/Main";
import { LessonVideo } from "./lesson-engine/LessonVideo";
import {
  promiseLessonDurationInFrames,
  promiseLessonSpec,
} from "./content/promiseLesson";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}

      <Composition
        id="PrototypeChain"
        component={PrototypeChainVideo}
        durationInFrames={9000} // 5 minutes * 60 seconds * 30 fps = 9000 frames
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PrototypeChainNeon"
        component={MainScene}
        durationInFrames={5400} // 3 minutes
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PrototypeJump"
        component={PrototypeJump}
        durationInFrames={120} // 4 seconds
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PrototypeChainTech"
        component={Main}
        durationInFrames={5400} // 3 minutes
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EventLoopViz"
        component={EventLoopMain}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PromiseLesson"
        component={LessonVideo}
        durationInFrames={promiseLessonDurationInFrames}
        fps={promiseLessonSpec.meta.fps}
        width={promiseLessonSpec.meta.width}
        height={promiseLessonSpec.meta.height}
        defaultProps={{
          spec: promiseLessonSpec,
        }}
      />
    </>
  );
};
