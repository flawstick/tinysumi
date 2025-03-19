"use client";

import Image from "next/image";
import {
  Heart,
  Camera,
  Calendar,
  Music,
  Home,
  ImageIcon,
  User,
  ListTodo,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "./_components/floating-nav";
import { AnimatedSection } from "./_components/animated-section";
import { motion } from "framer-motion";
import { useRef } from "react";
import { HydrateClient } from "@/trpc/server";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Photos",
    link: "#photos",
    icon: <ImageIcon className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Memories",
    link: "#memories",
    icon: <Camera className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "About Us",
    link: "#about",
    icon: <User className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Tasks",
    link: "/tasks",
    icon: <ListTodo className="h-4 w-4 text-pink-500" />,
  },
];

export default function HomePage() {
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the about section
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <FloatingNav navItems={navItems} />

      <header className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pink-100 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl">
              <Image
                src="/placeholder.svg?height=160&width=160"
                alt="Your Girlfriend"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 text-5xl font-bold text-pink-700 md:text-6xl"
          >
            For My Special Someone
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mb-8 max-w-2xl text-xl text-pink-600"
          >
            I made this cute little website just for you. Because you're amazing
            and deserve something as sweet as you are!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button className="rounded-full bg-pink-500 px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-pink-600 hover:shadow-xl">
              I ❤️ You!
            </Button>
          </motion.div>
        </div>

        {/* Scroll down indicator - without text */}
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <motion.button
            onClick={scrollToAbout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="group cursor-pointer"
            aria-label="Scroll down"
          >
            <div className="rounded-full border border-pink-200 bg-white/80 p-3 shadow-md backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-lg">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                }}
              >
                <ChevronDown className="h-6 w-6 text-pink-500" />
              </motion.div>
            </div>
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <AnimatedSection className="mb-24" id="about" ref={aboutSectionRef}>
          <h2 className="mb-12 text-center text-3xl font-bold text-pink-600 md:text-4xl">
            Our Story
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  How We Met
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  A little section about how we met and all our special moments
                  together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Calendar className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  Special Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  All the important dates and anniversaries we celebrate
                  together.
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Music className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  Our Playlist
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  The songs that remind us of each other and our special
                  moments.
                </p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24" delay={0.3} id="memories">
          <h2 className="mb-12 text-center text-3xl font-bold text-pink-600 md:text-4xl">
            Favorite Memories
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="group overflow-hidden border-pink-200 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=400&width=600`}
                    alt={`Memory ${i}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="py-4">
                  <h3 className="mb-2 text-lg font-semibold text-pink-600">
                    Memory Title {i}
                  </h3>
                  <p className="text-pink-700">
                    A short description of this wonderful memory we shared
                    together.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24" delay={0.4} id="photos">
          <h2 className="mb-12 text-center text-3xl font-bold text-pink-600 md:text-4xl">
            Photo Gallery
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md"
              >
                <Image
                  src={`/placeholder.svg?height=300&width=300`}
                  alt={`Photo ${i}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection
          className="mx-auto mb-24 max-w-2xl text-center"
          delay={0.5}
        >
          <h2 className="mb-8 text-3xl font-bold text-pink-600 md:text-4xl">
            A Little Note
          </h2>
          <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="mb-6 text-lg italic text-pink-700">
                "Every day with you is like a beautiful dream I never want to
                wake up from. You make my heart smile in ways I never thought
                possible."
              </p>
              <p className="font-medium text-pink-600">With all my love ❤️</p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>

      <footer className="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 px-4 py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4 text-pink-700">
            Made with love for the most amazing person in my world
          </p>
          <motion.div
            className="flex justify-center space-x-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Heart
                  key={i}
                  className="h-5 w-5 fill-pink-500 text-pink-500"
                />
              ))}
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
