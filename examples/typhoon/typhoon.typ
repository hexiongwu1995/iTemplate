// First import the library
#import "@preview/typhoon:0.2.0": *
#import html: *
// then define your HTML:
#html({
  head({
    // don't remember those metas!
    meta(charset: "utf-8")
    meta(name: "viewport", content: "width=device-width,initial-scale=1")
    title[Typhoon Main Page Showcase]
    // the tailwind-css() function produces a css string
    context { style(tailwind-css()) }
    // Or, if you want to specify your own configuration
    // context { style(tailwind-css(config: ..)) }
  })
  show std.html.elem: update-elem
  body(class: "bg-neutral-800", {
    // Then define your elements. No special notation needed. The plugin would
    // read the classes.
    html.div(
      class: {
        "p-10 w-full h-screen border-1 bg-neutral-300 overflow-x-scroll "
        " grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
      },
      div(class: "p-5 border-1 border-neutral-500")[Hi from grid!] * 5
    )
    // You can also use the typography plugin
    html.article(class: "prose")[
      // Now write your content here...
    ]
  })
})