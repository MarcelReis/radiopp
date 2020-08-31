import { extractRadio } from "../utils/firebaseExtract";

export default async function radioResolver(_: any, args, { firestore }) {
  const radiosRef = firestore.collection("radios").where("uri", "==", args.uri);

  const res = await radiosRef.get();
  const data = res.docs[0]?.data();

  return data ? extractRadio(res.docs[0].data()) : null;
}
