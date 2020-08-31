import { extractLocation } from "../utils/firebaseExtract";

export default async function locationsResolver(
  _: any,
  args,
  { firestore }: { firestore: FirebaseFirestore.Firestore }
) {
  const cityRef = firestore.collection("locations").limit(10);

  if (args.city) {
    cityRef.where("city", "==", args.city);
  }
  if (args.region) {
    cityRef.where("region", "==", args.region);
  }
  if (args.state) {
    cityRef.where("state", "==", args.state);
  }
  if (args.country) {
    cityRef.where("country", "==", args.country);
  }

  const res = await cityRef.get();
  return res.docs.map((snapshot) =>
    extractLocation(snapshot.data(), "Location")
  );
}
