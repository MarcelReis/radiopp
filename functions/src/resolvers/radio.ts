import { extractRadio } from "../utils/firebaseExtract";

export default async function radioResolver(_: any, args, { firestore }) {
  const radiosRef = firestore
    .collection("radios")
    .limit(1)
    .where("name", "==", args.name);

  const res = await radiosRef.get();
  return extractRadio(res.docs[0].data());
}
