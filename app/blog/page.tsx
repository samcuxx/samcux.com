import { Metadata } from "next";
import { BiDetail } from "react-icons/bi";
import Posts from "../components/pages/Posts";
import Social from "../components/shared/Social";
import { Slide } from "../animation/Slide";
import PageHeading from "@/app/components/shared/PageHeading";

export const metadata: Metadata = {
  title: "Blog | SamCux",
  metadataBase: new URL("https://samcuxx.vercel.app/blog"),
  description: "Read latest stories from SamCux's Blog",
  openGraph: {
    title: "Blog | SamCux",
    url: "https://samcuxx.vercel.app/blog",
    description: "Read latest stories from SamCux's Blog",
    images:
      "https://res.cloudinary.com/samuelamoah/image/upload/v1697975302/Samuel%20Amoah/vczdsywwhyhzoduglkid.jpg",
  },
};

export default async function Blog() {
  return (
    <main className="px-6 mx-auto max-w-7xl md:px-16">
      <PageHeading
        title="Blog"
        description="Welcome to my blog domain where I share personal stories about things I've learned, projects I'm hacking on and just general findings. I also write for other publications."
      >
        <Social type="publication" />
      </PageHeading>

      <Slide delay={0.1}>
        <div className="flex items-center mb-8 gap-x-3">
          <BiDetail />
          <h2 className="text-xl font-semibold tracking-tight">Explore All</h2>
        </div>
        <Posts />
      </Slide>
    </main>
  );
}
