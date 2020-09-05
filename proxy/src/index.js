import { Howl } from "howler";

const url = new URL(window.location.href);
const streamURL = url.searchParams.get("streamURL");

window.parent.postMessage({ name: "init" }, "*");

const sound = new Howl({
  src: [streamURL],
  html5: true,
  format: ["acc", "mp3"],
  autoplay: true,
});

const SOUND_ID = sound.play();
const SEEK_INTERVAL = 250;

sound.once("load", () => {
  sound.play(SOUND_ID);
  setInterval(() => {
    const time = sound.seek(SOUND_ID);

    window.parent.postMessage({ name: "info", time }, "*");
  }, SEEK_INTERVAL);
});

const HOWLER_EVENTS = [
  "play",
  "end",
  "pause",
  "stop",
  "mute",
  "volume",
  "rate",
  "seek",
  "fade",
  "unlock",
  "loaderror",
  "playerror",
];

HOWLER_EVENTS.forEach((eventName) =>
  sound.on(eventName, (soundID, error) =>
    window.parent.postMessage({ name: eventName, soundID, error }, "*")
  )
);

document.getElementById("player").addEventListener("click", () => {
  sound.play(SOUND_ID);
  window.parent.postMessage({ name: "interaction" }, "*");
});

window.addEventListener("message", ({ data }) => {
  switch (data.name) {
    case "play":
      sound.play(SOUND_ID);
      break;

    case "pause":
      sound.pause(SOUND_ID);
      break;

    case "stop":
      sound.stop(SOUND_ID);
      break;

    default:
      console.error("UNHANDLED MESSAGE", data);
      break;
  }
});
