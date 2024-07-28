"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const carouselItems = [
  "/images/event-1.jpg",
  "/images/event-2.jpg",
  "/images/event-3.jpg",
];

export const ImageSlider = () => {
  return (
    <div className="py-4">
      <Carousel
        className="relative overflow-hidden rounded-md"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="h-48 w-full rounded-lg">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={item}
                  alt={`carousel item ${index + 1}`}
                  fill
                  objectFit="cover"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
