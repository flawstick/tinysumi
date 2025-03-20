"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatingNav } from "@/app/_components/floating-nav";
import { AnimatedSection } from "@/app/_components/animated-section";
import { Home, ImageIcon, User, ListTodo } from "lucide-react";

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Photos",
    link: "/#photos",
    icon: <ImageIcon className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Memories",
    link: "/memories",
    icon: <Camera className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "About Us",
    link: "/#about",
    icon: <User className="h-4 w-4 text-pink-500" />,
  },
  {
    name: "Tasks",
    link: "/tasks",
    icon: <ListTodo className="h-4 w-4 text-pink-500" />,
  },
];

// Sample memories data
const memories = [
  {
    id: 1,
    title: "Our First Date",
    date: "June 15, 2022",
    location: "Central Park, New York",
    description:
      "We had our first date at a cute little café in Central Park. We talked for hours and watched the sunset together. It was the perfect beginning to our story.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["first date", "café", "sunset"],
  },
  {
    id: 2,
    title: "Beach Weekend Getaway",
    date: "August 10, 2022",
    location: "Malibu Beach",
    description:
      "We spent a wonderful weekend at Malibu Beach. We built sandcastles, went swimming, and had a romantic dinner by the ocean. The sound of the waves and your laughter made it magical.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["beach", "weekend", "ocean"],
  },
  {
    id: 3,
    title: "Our First Concert Together",
    date: "October 5, 2022",
    location: "Madison Square Garden",
    description:
      "We saw your favorite band live at Madison Square Garden. I'll never forget how you sang along to every song and the way your eyes lit up when they played your favorite track.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["concert", "music", "night out"],
  },
  {
    id: 4,
    title: "Holiday Season Together",
    date: "December 25, 2022",
    location: "Home Sweet Home",
    description:
      "Our first Christmas together was so special. We decorated the tree, exchanged gifts, and spent the day watching holiday movies. Your smile when you opened my gift made my heart melt.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["christmas", "holidays", "home"],
  },
  {
    id: 5,
    title: "Valentine's Day Surprise",
    date: "February 14, 2023",
    location: "Rooftop Restaurant",
    description:
      "I surprised you with dinner at that rooftop restaurant you'd been wanting to try. The city lights below us, the stars above, and you by my side - it was perfect in every way.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["valentine's day", "surprise", "dinner"],
  },
  {
    id: 6,
    title: "Spring Picnic in the Park",
    date: "April 22, 2023",
    location: "Botanical Gardens",
    description:
      "We had a lovely picnic surrounded by blooming flowers in the botanical gardens. We read books, took photos, and simply enjoyed each other's company in the sunshine.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    tags: ["picnic", "spring", "flowers"],
  },
];

export default function MemoriesPage() {
  const router = useRouter();
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMemoryClick = (id: number) => {
    setSelectedMemory(id);
    setCurrentImageIndex(0);
  };

  const handleClose = () => {
    setSelectedMemory(null);
  };

  const handlePrevImage = () => {
    if (selectedMemory !== null) {
      const memory = memories.find((m) => m.id === selectedMemory);
      if (memory) {
        setCurrentImageIndex((prev) =>
          prev === 0 ? memory.images.length - 1 : prev - 1,
        );
      }
    }
  };

  const handleNextImage = () => {
    if (selectedMemory !== null) {
      const memory = memories.find((m) => m.id === selectedMemory);
      if (memory) {
        setCurrentImageIndex((prev) =>
          prev === memory.images.length - 1 ? 0 : prev + 1,
        );
      }
    }
  };

  const selectedMemoryData =
    selectedMemory !== null
      ? memories.find((m) => m.id === selectedMemory)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20">
      <FloatingNav navItems={navItems} />

      <div className="container mx-auto px-4 pt-20">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            className="mr-4 p-2 text-pink-700 hover:bg-pink-100 hover:text-pink-800"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-pink-700">
            Our Special Memories
          </h1>
        </div>

        <p className="mb-12 max-w-3xl text-lg text-pink-600">
          A collection of our most cherished moments together. Each memory tells
          a part of our beautiful story.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory, index) => (
            <AnimatedSection
              key={memory.id}
              delay={index * 0.1}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="h-full"
                onClick={() => handleMemoryClick(memory.id)}
              >
                <Card className="h-full cursor-pointer overflow-hidden border-pink-200 transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={memory.images[0] || "/placeholder.svg"}
                      alt={memory.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="mb-1 text-xl font-bold text-white">
                        {memory.title}
                      </h3>
                      <div className="flex items-center text-sm text-white/90">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{memory.date}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start">
                      <MapPin className="mr-1 mt-0.5 h-4 w-4 flex-shrink-0 text-pink-500" />
                      <p className="text-sm text-gray-600">{memory.location}</p>
                    </div>
                    <p className="mb-3 line-clamp-3 text-gray-700">
                      {memory.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-pink-200 bg-pink-50 text-pink-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Memory Detail Modal */}
        {selectedMemory !== null && selectedMemoryData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white"
            >
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-2xl font-bold text-pink-700">
                  {selectedMemoryData.title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-gray-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="relative aspect-video">
                  <Image
                    src={
                      selectedMemoryData.images[currentImageIndex] ||
                      "/placeholder.svg"
                    }
                    alt={`${selectedMemoryData.title} image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />

                  {selectedMemoryData.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>

                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-1">
                        {selectedMemoryData.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 w-2 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{selectedMemoryData.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{selectedMemoryData.location}</span>
                    </div>
                  </div>

                  <p className="mb-6 leading-relaxed text-gray-700">
                    {selectedMemoryData.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedMemoryData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="border-pink-200 bg-pink-100 text-pink-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center border-t border-gray-200 bg-gray-50 p-4">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  <Heart className="mr-2 h-4 w-4" />
                  Mark as Favorite
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
