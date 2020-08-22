import { responseMock } from "./mock";

export type RadioResponseType = {
  info: RadioType[];
  now: string;
};

export type RadioType = {
  city: string;
  logo_url: string;
  name: string;
  radio_id: number;
  detections: DetectionsType[] | null;
  state: string;
  streaming_url: string;
};

export type DetectionsType = {
  detected_at: string;
  dns: string | null;
  id: number | null;
  id_musica: number | null;
  img: string | null;
  track_artist: string;
  track_duration: number;
  track_id: number;
  track_title: string;
  url: string | null;
  video_yt: string | null;
};

const HOST = "http://localhost:5001/radiopp-acbbe/us-central1";
const ENDPOINT = "radios";
const URL = `${HOST}/${ENDPOINT}`;

class API {
  private radios: RadioType[] = [];
  private now: Date | null = null;

  constructor() {
    this.getRadios();
  }

  public async getRadios() {
    return responseMock.info;

    // if (this.radios.length > 0) {
    //   return this.radios;
    // }

    // const res: RadioResponseType = await (await fetch(URL)).json();

    // this.radios = res.info;
    // this.now = new Date(res.now);

    // return this.radios;
  }
}

export const RadioAPI = new API();
