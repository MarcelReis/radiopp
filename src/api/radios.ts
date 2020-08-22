export type ResponseType = {
  info: RadioType[];
  now: string;
};

export type RadioType = {
  city: string;
  logo_ur: string;
  name: string;
  radio_id: 235;
  detections: DetectionsType[];
  state: string;
  streaming_url: string;
};

export type DetectionsType = {
  detected_at: string;
  dns: string;
  id: number;
  id_musica: number;
  img: string;
  track_artist: string;
  track_duration: number;
  track_id: number;
  track_title: string;
  url: string;
  video_yt: string;
};

const HOST = "http://localhost:5001/radiopp-acbbe/us-central1";
const ENDPOINT = "radios";
const URL = `${HOST}/${ENDPOINT}`;

class RadioAPI {
  public radios: RadioType[] = [];
  public now: Date | null = null;

  constructor() {
    this.getRadios();
  }

  public async getRadios() {
    if (this.radios.length > 0) {
      return this.radios;
    }

    const res: ResponseType = await (await fetch(URL)).json();

    this.radios = res.info;
    this.now = new Date(res.now);

    return this.radios;
  }
}

export const Radio = new RadioAPI();
