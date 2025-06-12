import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

ScrollSmoother.create({
  smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

SplitText.create("h1", {
    type: "lines",
    linesClass: "line",
    onSplit: (split) => {
        gsap.from(split.lines, {
            duration: 0.5,
            opacity: 0,
            y: 500,
            ease: "power2.out",
            stagger: {
                each: .2,
                from: "start",
                // grid: "auto",
            }
        });
        // split.lines.forEach((line, index) => {
        //     gsap.from(line, {
        //         duration: 0.5,
        //         opacity: 0,
        //         y: 500,
        //         ease: "power2.out",
        //         // ease: "elastic.out(1,0.3)",
        //         delay: index * 0.1
        //     });
        // });
    }
});

const tl = gsap.timeline({});
tl.from('h1', {
    duration: 1,
    opacity: 1,
    y: -100,
    ease: "power2.out",
})

