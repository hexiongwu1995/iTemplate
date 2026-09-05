#import "itemplate.typ": *
// #import "@preview/itemplate: 0.1.0": *
#show: contents => itemplate(title: "itemplate", contents)

= #lorem(3)

#lorem(20)

== #lorem(3)

#lorem(20)


#block(
  html.div(
    style: "position: relative;",
    class: "canvas-wrapper",
    html.canvas(
      style: "width: 100%;aspect-ratio: 1.25; margin: 0 auto;",
      id: "canvas-main",
    ),
  ),
)

#html.script(
  type: "module",
  src: "./main.js",
)


= #lorem(3)

#lorem(20)


== #lorem(3)

#lorem(20)



// #block(
// html.iframe(
//       style: "width: 100%; height: 400px; margin: 0 auto;",
//       src: "//player.bilibili.com/player.html?isOutside=true&aid=115948078040084&bvid=BV1udzrBeEfx&cid=35578053293&p=1",
//       allowfullscreen: true,
//     )
// )

