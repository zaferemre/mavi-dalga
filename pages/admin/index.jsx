import { NextStudio } from "next-sanity/studio";
import config from "../../mavidalga-blog/sanity.config";

export default function AdminPage() {
  return <NextStudio config={config} />;
}
