import * as functions from "firebase-functions";
import fetch from "node-fetch";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const radios = functions.https.onRequest(async (_, response) => {
  const radios = await (
    await fetch(
      "https://radio.letras.mus.br/radioinfo/?ids=235%2C403%2C396%2C6%2C9332%2C2781%2C37%2C2438%2C1895%2C8804%2C2754%2C2421%2C2603%2C2%2C9675%2C8142%2C2758%2C2441%2C2883%2C1%2C2780%2C2762%2C2608%2C1596%2C630%2C9347%2C1131%2C2435%2C2884%2C15956%2C14075%2C3651%2C2426%2C4076%2C2387%2C385%2C1977%2C15807%2C2382%2C399%2C2498%2C2389%2C2494%2C71%2C2768%2C329%2C2442%2C3733%2C3%2C3626%2C25%2C1216%2C1212%2C2495%2C387%2C1224%2C395%2C2740%2C2243%2C3297%2C1120%2C2177%2C2261%2C15072%2C41%2C210%2C2386%2C2391%2C3284%2C15310%2C2756%2C356%2C7319%2C1739%2C10667%2C967%2C9209%2C507%2C1211%2C4066%2C6172%2C7148%2C12977%2C12111%2C9668%2C3761%2C8369%2C10201%2C7768%2C1042%2C2698%2C4197%2C3658%2C9246%2C987%2C1207%2C7756%2C1140%2C3967%2C27136%2C3767",
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        method: "GET",
      }
    )
  ).json();

  response.send(radios);
});
