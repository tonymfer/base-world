import React, { useRef, useEffect } from "react";
import { useMapStore } from "@/app/stores/map";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function TextGlitch({ title }: { title: string }) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const intervalRef = useRef<number | null>(null);
  const ready = useMapStore((state) => state.ready);

  useEffect(() => {
    let iteration = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      if (h1Ref.current) {
        const datasetValue = h1Ref.current.dataset.value;
        const valueLength = datasetValue ? datasetValue.length : 0;

        h1Ref.current.innerText = Array.from(datasetValue || "")
          .map((letter, index) => {
            if (index < iteration) {
              return datasetValue?.[index] ?? "";
            }

            if (datasetValue?.[index] === " ") {
              return " "; // Ignore empty space
            }

            return letters[Math.floor(Math.random() * 10)];
          })
          .join("");

        if (iteration >= valueLength && intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        iteration += 1 / 3;
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <h1
      className={`absolute left-1/2 top-1/2 hidden w-[300px] -translate-x-1/2 -translate-y-1/2 whitespace-pre-wrap text-7xl font-semibold text-black`}
      style={{
        textShadow: "0px 0px 30px rgba(0, 0, 0, 1)",
        fontSize: ready ? "0" : "50px",
        transitionDuration: "1s",
        transitionProperty: "font-size",
        transitionTimingFunction: "ease-in-out",
      }}
      ref={h1Ref}
      data-value={title}
    ></h1>
  );
}
