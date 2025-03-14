"use client";;
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

import {cn} from "../../lib/utils.js"

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() =>
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    }), [springValue, decimalPlaces]);

  return (
    (<span
      ref={ref}
      className={cn(
        "inline-block tabular-nums tracking-wider text-black dark:text-white",
        className
      )}
      {...props} />)
  );
}
