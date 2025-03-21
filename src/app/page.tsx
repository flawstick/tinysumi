"use client";

import Image from "next/image";
import {
  Heart,
  Camera,
  Home,
  ListTodo,
  ChevronDown,
  BookOpen,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNav } from "./_components/floating-nav";
import { AnimatedSection } from "./_components/animated-section";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

const navItems = [
  {
    name: "Home",
    link: "/littlespace",
    icon: <Home className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Memories",
    link: "/littlespace/memories",
    icon: <Camera className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Tasks",
    link: "/littlespace/tasks",
    icon: <ListTodo className="h-4 w-4 text-pink-500" />,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: verse, isLoading: isVerseLoading } =
    api.bible.getDailyVerse.useQuery();
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the about section
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const session = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <FloatingNav navItems={navItems} />

      <header className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pink-100 opacity-70"></div>
          <div className="absolute inset-0 bg-[url('/hk.jpg')] bg-cover bg-center"></div>
        </div>

        <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl">
              <Image src="/hk.gif" alt="Sumi" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 text-5xl font-bold text-pink-700 md:text-6xl"
          >
            Hi, I'm Sumi!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mx-auto mb-8 max-w-2xl text-xl text-pink-600"
          >
            Christian • Valorant Player • Tiny
          </motion.p>

          {!!session && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                className="rounded-full bg-pink-500 px-8 py-6 text-lg text-white shadow-lg transition-all duration-300 hover:bg-pink-600 hover:shadow-xl"
                onClick={() => router.push("/littlespace")}
              >
                My Tasks <ListTodo className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
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
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
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
            About Me
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  Relationship
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  My favorite hobby is talking to my amazing boyfriend. He's my
                  best friend and the love of my life! 💕
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <BookOpen className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  Faith
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  My Christian faith is an important part of who I am. I love
                  attending church and reading scripture. ✝️
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <Coffee className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle className="text-center text-xl text-pink-600">
                  Fun Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center text-pink-700">
                <p>
                  I'm very short but full of energy! I love cute things, the
                  color pink, and drinking bubble-less redbull.
                </p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24" delay={0.3} id="hobbies">
          <h2 className="mb-12 text-center text-3xl font-bold text-pink-600 md:text-4xl">
            My Hobbies
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="group overflow-hidden border-pink-200 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="/giphy.webp"
                  alt="Valorant"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">Valorant</h3>
                  <p className="text-sm text-white/90">
                    My favorite game to play
                  </p>
                </div>
              </div>
              <CardContent className="py-4">
                <p className="text-pink-700">
                  I love playing Valorant! My main agents are Jett and Sage. I'm
                  not the best player, but I have a lot of fun, especially when
                  playing with my boyfriend.
                </p>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border-pink-200 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src="/happy.gif"
                  alt="Chatting"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">
                    Talking with My Boyfriend
                  </h3>
                  <p className="text-sm text-white/90">My favorite person</p>
                </div>
              </div>
              <CardContent className="py-4">
                <p className="text-pink-700">
                  My absolute favorite thing to do is talk with my boyfriend.
                  Whether we're video chatting, texting, or spending time
                  together, it's always the highlight of my day!
                </p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>

        <AnimatedSection
          className="mx-auto mb-24 max-w-2xl text-center"
          delay={0.5}
        >
          <h2 className="mb-8 text-3xl font-bold text-pink-600 md:text-4xl">
            Daily Verse
          </h2>
          <Card className="border-pink-200 bg-white/80 shadow-md backdrop-blur-sm">
            <CardContent className="pt-6">
              {isVerseLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-pink-300 border-t-pink-600"></div>
                </div>
              ) : (
                <>
                  <p className="mb-6 text-lg italic text-pink-700">
                    "{verse?.text ?? "Loading verse..."}"
                  </p>
                  <p className="font-medium text-pink-600">
                    {verse?.reference} ({verse?.version}) ✝️
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </main>

      <footer className="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100 px-4 py-8">
        <div className="container mx-auto text-center">
          <p className="mb-4 text-pink-700">Made with love for Sumi</p>
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
    </div>
  );
}
