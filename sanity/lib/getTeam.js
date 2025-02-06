import { sanityFetch } from "./fetch";

const teamQuery = `*[_type == "team"] | order(name asc) {
  _id,
  name,
  role,
  slug,
  bio,
  image {
    asset -> {
      url
    }
  }
}`;

export async function getTeamMembers() {
  return await sanityFetch({ query: teamQuery });
}
