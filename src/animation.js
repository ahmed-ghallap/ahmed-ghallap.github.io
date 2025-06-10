import { gsap } from "gsap";

import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

// إعدادات التكرار للموجة
const waveDefaults = {
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  duration: 4,
};

// إعدادات الشعارات داخل الموجة
const logosDefaults = {
  duration: 2,
  repeat: -1,
  yoyo: true,
  x: 'random([-50, 50])',
  y: 'random([-20, 30])',
  scale: 'random(0.8, 1.2)',
  rotate: 'random([-10, 10])',
  origin: "center center",
  transformOrigin: "center center",
  ease: "sine.inOut",
  stagger: {
    each: 0.1,
    from: "random",
  }
};

// حركة الموجة على مسار أقرب للطبيعة
const createWaveMotion = (selector, amplitude = 30, distance = 100) => {
  gsap.to(selector, {
    motionPath: {
      path: [
        { x: -distance, y: 0 },
        { x: -distance / 2, y: -amplitude },
        { x: 0, y: 0 },
        { x: distance / 2, y: amplitude },
        { x: distance, y: 0 },
      ],
      curviness: 1.5,
      autoRotate: false
    },
    ...waveDefaults,
  });
};

// إنشاء التايملاين الكلي
const logoWavesTl = gsap.timeline();

// إنشاء الحركات
createWaveMotion("#wave-1", 25, 60);
createWaveMotion("#wave-2", 30, 80);
createWaveMotion("#wave-3", 20, 50);

// إضافة تحريك الشعارات مع كل موجة
logoWavesTl.to('#vite, #django', logosDefaults, 0);
logoWavesTl.to('#figma, #fastapi', logosDefaults, 0);
logoWavesTl.to('#react, #python', logosDefaults, 0);
