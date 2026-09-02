"use client";

import { useRef } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/seo";

/**
 * The team video: a circular thumbnail that opens a player.
 *
 * The client asked whether a talking head could go in the hero, the way
 * salutemreal.cz does it. It turned out they do not do that either: their
 * three videos are 96px circles with a duration beside them, sitting next to
 * section headings roughly halfway down the page. This is the same pattern,
 * and it belongs here rather than in the hero for three reasons — the hero
 * already runs a video (its background loop), a talking head is *audio* and
 * browsers only autoplay muted, and a second call to action next to "Chci
 * zjistit, jak investovat" splits the one decision the hero is asking for.
 *
 * Nothing autoplays. The click is the user gesture that lets the player start
 * with sound, and `preload="none"` means the file is not touched until then —
 * which matters here, because the placeholder clip is 15 MB (no ffmpeg on the
 * build machine to compress it; the real cut needs a proper encode).
 *
 * PLACEHOLDER CONTENT. The clip is stock and is labelled as such on screen.
 * A stock actor presented as the person who signs the calculations would cost
 * more credibility than having no video at all, so the caption says what it
 * is until real footage exists. Replacing it means dropping in a new file and
 * re-cutting the poster frame — that was made by drawing the video onto a
 * canvas at 2.2s (224x224 centre crop, q0.72), see
 * scratchpad/write-poster.js in the commit that added this.
 */
const VIDEO = {
  src: "/video/tym-ukazka.mp4",
  poster: "/photo/tym/video-poster.jpg",
  /** From the file's own metadata: 24.9s. */
  duration: "0:25",
  title: "Jak vybíráme projekty a co za propočtem stojí",
};

export function TeamVideo() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    // Started from inside the click handler, so sound is permitted.
    void videoRef.current?.play();
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div className="team-video shrink-0">
      <button type="button" onClick={open} className="team-video-trigger focus-ring">
        <span className="team-video-thumb">
          <Image
            src={withBasePath(VIDEO.poster)}
            alt=""
            aria-hidden="true"
            width={224}
            height={224}
            className="team-video-poster"
          />
          <span aria-hidden="true" className="team-video-play">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M13 8 0 15.79V.21L13 8Z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="team-video-copy">
          <span className="text-label text-text-muted">Video · {VIDEO.duration}</span>
          <span className="text-subheading mt-2 block max-w-[24ch] text-navy">{VIDEO.title}</span>
          {/* Says what it is. Goes with the clip. */}
          <span className="text-disclaimer mt-2 block text-text-muted">
            Ukázka umístění — zástupné video
          </span>
        </span>
      </button>

      {/*
        A native <dialog>: Escape, the backdrop and the focus trap come with
        it, and there is no state to keep in sync. `onClose` fires for every
        way out, including Escape, so the video can never keep playing behind
        a closed dialog.
      */}
      <dialog
        ref={dialogRef}
        className="team-video-dialog"
        aria-label={VIDEO.title}
        onClose={stop}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="team-video-frame">
          <video
            ref={videoRef}
            src={withBasePath(VIDEO.src)}
            poster={withBasePath(VIDEO.poster)}
            controls
            playsInline
            preload="none"
            className="team-video-player"
          />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="team-video-close focus-ring"
            aria-label="Zavřít video"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </dialog>
    </div>
  );
}
