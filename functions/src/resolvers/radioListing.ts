import { extractRadio } from "../utils/firebaseExtract";

export default async function radioListingResolver(
  _: any,
  args,
  { firestore }
) {
  const radiosRef = firestore
    .collection("radios")
    .limit(+args.limit)
    .where("city", "==", args.city);

  const res = await radiosRef.get();
  return res.docs.map((snapshot) => extractRadio(snapshot.data()));
}
