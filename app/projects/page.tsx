import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { projectsQuery } from "@/lib/sanity.query";
import type { ProjectType } from "@/types";
import EmptyState from "../components/shared/EmptyState";
import { Slide } from "../animation/Slide";
import { sanityFetch } from "@/lib/sanity.client";
import PageHeading from "../components/shared/PageHeading";

export const metadata: Metadata = {
  title: "Project | SamCux",
  metadataBase: new URL("https://samcuxx.vercel.app/projects"),
  description: "Explore projects built by SamCux",
  openGraph: {
    title: "Projects | SamCux",
    url: "https://samcuxx.vercel.app/projects",
    description: "Explore projects built by SamCux",
    images:
      "https://res.cloudinary.com/samuelamoah/image/upload/v1697976798/Samuel%20Amoah/carcf7uwbsmlmmubcuo4.jpg",
  },
};

export default async function Project() {
  const projects: ProjectType[] = await sanityFetch({
    query: projectsQuery,
    tags: ["project"],
  });

  return (
    <main className="px-6 mx-auto max-w-7xl md:px-16">
      <PageHeading
        title="Projects"
        description="I've worked on tons of little projects over the years but these are the ones that I'm most proud of. Many of them are open-source, so if you see something that piques your interest, check out the code and contribute if you have ideas on how it can be improved."
      />

      <Slide delay={0.1}>
        {projects.length > 0 ? (
          <section className="grid grid-cols-1 gap-5 mb-12 xl:grid-cols-3 md:grid-cols-2">
            {projects.map((project) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project._id}
                className="flex items-center p-4 border border-transparent rounded-lg gap-x-4 dark:bg-primary-bg bg-zinc-50 dark:hover:border-zinc-700 hover:border-zinc-200"
              >
                {project.logo ? (
                  <Image
                    src={project.logo}
                    width={60}
                    height={60}
                    alt={project.name}
                    className="p-2 rounded-md dark:bg-zinc-800 bg-zinc-100"
                  />
                ) : (
                  <div className="p-2 text-3xl border border-transparent rounded-lg dark:bg-primary-bg bg-zinc-50 dark:hover:border-zinc-700 hover:border-zinc-200">
                    🪴
                  </div>
                )}
                <div>
                  <h2 className="mb-1 text-lg tracking-wide">{project.name}</h2>
                  <div className="text-sm dark:text-zinc-400 text-zinc-600">
                    {project.tagline}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <EmptyState value="Projects" />
        )}
      </Slide>
    </main>
  );
}
