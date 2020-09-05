import { Howl } from "howler";

const url = new URL(window.location.href);
const streamURL = url.searchParams.get("streamURL");

window.parent.postMessage("init", "*");

const sound = new Howl({
  src: [streamURL],
  html5: true,
  format: ["acc", "mp3"],
  autoplay: true,
});

const RADIO_ID = sound.play();

sound.once("load", () => sound.play(RADIO_ID));

sound.on("play", () => {
  window.parent.postMessage("play", "*");
});

sound.on("pause", () => {
  window.parent.postMessage("pause", "*");
});

sound.on("load", () => {
  window.parent.postMessage("load", "*");
});

sound.on("loaderror", () => {
  window.parent.postMessage("loaderror", "*");
});

sound.on("stop", () => {
  window.parent.postMessage("stop", "*");
});

document.getElementById("player").addEventListener("click", () => {
  sound.play(RADIO_ID);
  window.parent.postMessage("interaction", "*");
});

window.addEventListener("message", ({ data }) => {
  console.log("data", data);
  switch (data) {
    case "play":
      sound.play(RADIO_ID);
      break;

    case "pause":
      sound.pause(RADIO_ID);
      break;

    case "stop":
      sound.stop(RADIO_ID);
      break;

    default:
      break;
  }
});
