"use client";

import { Sprite, Stage } from "./animations";
import { GUT_BG, GUT_SCENES, GutChromeForCurrentTime } from "./gut-scenes";

const schedule = GUT_SCENES;
const TOTAL_DURATION = schedule[schedule.length - 1].end;

export function GutApp() {
  return (
    <Stage
      width={1920}
      height={1080}
      duration={TOTAL_DURATION}
      background={GUT_BG}
      persistKey="gut-microbiome"
    >
      {schedule.map((s) => {
        const C = s.component;
        return (
          <Sprite key={s.title} start={s.start} end={s.end}>
            <C />
          </Sprite>
        );
      })}
      <GutChromeForCurrentTime
        scenes={schedule}
        totalDuration={TOTAL_DURATION}
      />
    </Stage>
  );
}
