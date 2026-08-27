// src.typ
#html.elem(
  "html",
  attrs: (lang: "en"),
)[
  #html.elem(
    "head",
  )[
    #html.elem("meta", attrs: (charset: "utf-8"))[]
    #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1"))[]
    #html.elem("link", attrs: (rel: "stylesheet", href: "https://at.alicdn.com/t/c/font_5215219_v2x8fivud1r.css"))[]
    #html.elem("link", attrs: (
      rel: "stylesheet",
      href: "https://unpkg.com/@hexiongwu1995/itemplate/styles/styles.css",
    ))[]
    #html.elem("script", attrs: (
      src: "https://unpkg.com/@hexiongwu1995/itemplate/scripts/script.js",
    ))[]
    #html.elem("script", attrs: (src: "https://unpkg.com/mathjax@4/startup.js"))[]
    #html.elem("script", attrs: (type: "module", src: "https://unpkg.com/mathjax@4/startup.js"))[]
    #html.elem("script", attrs: (type: "importmap"))[

    ]
  ]

  #html.elem(
    "body",
  )[
    = A level 1 heading
    some texts
  ]
]
