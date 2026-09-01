#import "itemplate.typ": *
// #import "@preview/itemplate: 0.1.0": *
#show: contents => itemplate(title: "itemplate", contents)

= #lorem(3)

#lorem(20)

// <iframe width="560" height="360" src="//player.bilibili.com/player.html?isOutside=true&aid=901303033&bvid=BV1KN4y1A7E5&cid=852699275&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

#html.iframe(
  width: 560, 
  height: 360,
  src: "//player.bilibili.com/player.html?isOutside=true&aid=901303033&bvid=BV1KN4y1A7E5&cid=852699275&p=1",
  // frameborder: 0,
  allowfullscreen: true,
  // scrolling: "no",
  // framespacing: 0,
)

== #lorem(3)

#lorem(20)
#html.elem("div", attrs: (
  style: "background: white; margin-top: 50px; width: 100%; height: 30vh",
  id: "lighting",
))[]

#html.script(
  type: "module",
  src: "./lighting.js",
)

= #lorem(3)

#lorem(20)

== #lorem(3)

#lorem(20)

#html.elem("div", attrs: (
  style: "background: white; margin-top: 50px; width: 100%; height: 30vh",
  id: "three-orbital-cube",
))[]

#html.script(
  type: "module",
  src: "https://unpkg.com/@hexiongwu1995/itemplate/examples/itemplate/three-orbital-cube.js",
)

// #html.script(
//   type: "module",
//   src: "./assets/three-js/three-orbital-cube.js",
// )

