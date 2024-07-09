import { Slide } from "../animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/app/components/shared/PageHeading";

const images = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1618385772346-943ce2f53f09?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1565172265978-aaa872e3f618?auto=format&fit=crop&q=80&w=1854&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1611096002616-763f16ef15f3?auto=format&fit=crop&q=80&w=1888&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const metadata: Metadata = {
  title: "Photos | SamCux",
  metadataBase: new URL("https://samcuxx.vercel.app/photos"),
  description: "Explore photos taken by SamCux",
  openGraph: {
    title: "Photos | SamCux",
    url: "https://samcuxx.vercel.app/photos",
    description: "Explore photos taken by SamCux",
    images:
      "https://res.cloudinary.com/samuelamoah/image/upload/v1697975913/Samuel%20Amoah/ueccqo5ha4opguuxvcwp.jpg",
  },
};

export default function Photos() {
  return (
    <main className="px-6 mx-auto mt-20 max-w-7xl md:px-16 lg:mt-32">
      <PageHeading
        title="Photos"
        description="This page is still under construction..."
      />
      <figure className="my-6">
        <Slide delay={0.12} className="flex flex-wrap gap-2">
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.src}
              alt="playing guitar"
              width={350}
              height={800}
              className="dark:bg-primary-bg bg-secondary-bg"
            />
          ))}
        </Slide>
      </figure>
    </main>
  );
}
