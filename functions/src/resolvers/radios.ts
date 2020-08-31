import { extractRadio } from "../utils/firebaseExtract";

export default async function radioListingResolver(
  parent: any,
  args,
  { firestore }
) {
  const limit = args.limit > 50 ? 50 : args.limit;

  const radiosRef = firestore.collection("radios").limit(limit);

  if (args.uri) {
    radiosRef.where("uri", "==", args.uri);
  } else {
    if (args.city) {
      radiosRef.where("city", "==", args.city);
    }
    if (args.state) {
      radiosRef.where("state", "==", args.state);
    }
    if (args.region) {
      radiosRef.where("region", "==", args.region);
    }
    if (args.country) {
      radiosRef.where("country", "==", args.country);
    }
  }

  const res = await radiosRef.get();
  return res.docs.map((snapshot) => extractRadio(snapshot.data(), "Radio"));
}
