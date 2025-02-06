import { sanityFetch } from "../../../sanity/lib/fetch";
import { client } from "../../../sanity/lib/client";
import Image from "next/image";
import PropTypes from "prop-types";

// Sanity query to fetch a single team member by slug
const teamMemberQuery = `*[_type == "team" && slug.current == $slug][0] {
  name,
  role,
  bio,
  slug,
  image {
    asset -> {
      url
    }
  }
}`;

// Sanity query to fetch all team member slugs
const teamMemberPathsQuery = `*[_type == "team"]{ "slug": slug.current }`;

// **1️⃣ Generate all paths for static generation**
export async function getStaticPaths() {
  try {
    const members = await client.fetch(teamMemberPathsQuery);

    // Debugging: Log fetched slugs to verify structure
    console.log("Fetched team members:", members);

    // Ensure slugs exist
    const paths = members
      .filter((member) => member.slug) // Avoid null slugs
      .map((member) => ({
        params: { slug: member.slug },
      }));

    return { paths, fallback: "blocking" }; // Enable blocking fallback for ISR
  } catch (error) {
    console.error("Error fetching team member paths:", error);
    return { paths: [], fallback: "blocking" };
  }
}

// **2️⃣ Fetch team member data for each page**
export async function getStaticProps({ params }) {
  try {
    const slug = params?.slug; // Ensure slug exists
    if (!slug) {
      return { notFound: true };
    }

    const member = await sanityFetch({
      query: teamMemberQuery,
      params: { slug },
    });

    if (!member) {
      return { notFound: true };
    }

    return {
      props: { member },
      revalidate: 10, // Enable Incremental Static Regeneration
    };
  } catch (error) {
    console.error("Error fetching team member:", error);
    return { notFound: true };
  }
}

// **3️⃣ Render the team member page**
export default function TeamMemberPage({ member }) {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        {member.image?.asset?.url && (
          <Image
            src={member.image.asset.url}
            alt={member.name}
            width={500}
            height={500}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}
        <h1 className="text-3xl font-bold mt-4">{member.name}</h1>
        <p className="text-xl text-gray-500">{member.role}</p>
        <p className="mt-4 text-gray-700">{member.bio}</p>
      </div>
    </div>
  );
}

// **4️⃣ Add PropTypes validation (optional)**
TeamMemberPage.propTypes = {
  member: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    bio: PropTypes.string,
    slug: PropTypes.shape({
      current: PropTypes.string,
    }),
    image: PropTypes.shape({
      asset: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
  }).isRequired,
};
