import {gsap} from "gsap";
import {Group} from "three";

export default function animateComboBasic(
    object,
    duration,
    delay,
    w,
    h,
    scale,
    opacity
) {

  function run(obj) {
    gsap.killTweensOf(obj.scale)
    gsap.killTweensOf(obj.material)

    obj.scale.x = w
    obj.scale.y = h
    obj.material.opacity = opacity

    gsap.from(obj.scale, {
      x: w * scale,
      y: h * scale,
      duration: duration * 0.5,
      onComplete: () => {
        gsap.to(obj.scale, {
          x: w,
          y: h,
          duration: duration * 0.5,
          onComplete: () => {
            gsap.to(obj.scale, {
              y: 0,
              delay: delay - duration,
              duration: duration,
            })
          }
        })
      }
    })

    gsap.to(obj.material, {
      opacity: 0,
      duration: duration,
      delay: delay,
      ease: 'power1.in'
    })
  }

  if (object instanceof Group) {
    object.children.forEach((obj) => {
      run(obj)
    })
  } else {
    run(object)
  }
}