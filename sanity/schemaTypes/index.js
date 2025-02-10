import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { welcomeText } from "./welcomeText";
// /sanity/schemaTypes/index.js

import { teamSchema } from "./team"; // Import the team schema

export const schema = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    teamSchema,
    welcomeText,
  ],
};
