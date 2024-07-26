"use client";
import * as TWEEN from "@tweenjs/tween.js";
import { useScrollBlock } from "@/app/hooks/useScrollBlock";
import { useLandingStore } from "@/app/stores/landing";
import isMobile from "@/app/utils/device";
import { activateGlobe } from "@/app/utils/globe";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/app/utils/cn";

export default function Details() {
  const ref = useRef<HTMLDivElement>(null);
  const scrolling = useLandingStore((s) => s.scrolling);
  const setScrolling = useLandingStore((s) => s.setScrolling);
  const [blockScroll] = useScrollBlock();

  useEffect(() => {
    const mobile = isMobile();
    const smoothScroll = (target: number, duration: number) => {
      if (scrolling) return;
      setScrolling(true);
      blockScroll();
      activateGlobe();
      const start = window.scrollY;
      let animateId: number;

      const tween = new TWEEN.Tween({ y: start })
        .to({ y: target }, duration)
        .easing(TWEEN.Easing.Quintic.Out)
        .onUpdate((obj) => {
          window.scrollTo(0, obj.y);
        })
        .onComplete(() => {
          setScrolling(false);
          blockScroll();
        })
        .start();

      const animate = (time: number) => {
        animateId = requestAnimationFrame(animate);
        TWEEN.update(time);
      };
      requestAnimationFrame(animate);
      return () => {
        // This will stop the tween when the component unmounts
        if (tween) {
          tween.stop();
        }

        // Cancel the animation frame request
        cancelAnimationFrame(animateId);
      };
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const ratio = entry.intersectionRatio;
        const trigger = mobile ? ratio >= 1 : ratio >= 1;
        console.log("trigger", trigger, ratio);
        if (!scrolling && trigger) {
          smoothScroll(0, 1000);
        }
      },
      {
        rootMargin: "0px",
        threshold: 1,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [scrolling]);

  return (
    <div id="details" ref={ref} className="">
      <StickyScroll content={content} />
    </div>
  );
}
const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Collaborative Editing
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        {/* <Image
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        /> */}
      </div>
    ),
  },
];

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = ["var(--white)", "var(--black)"];
  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      id="details"
      ref={ref}
      className="flex justify-start pt-[200px] h-screen padded-horizontal tablet:pt-15 laptop:pt-[120px] w-screen"
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg text-slate-300 max-w-sm mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "hidden lg:block h-60 w-screen rounded-md bg-white sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
