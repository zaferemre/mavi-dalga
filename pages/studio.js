"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../sanity.config"; // Importing from root

export default function StudioPage() {
  return <NextStudio config={config} />;
}
