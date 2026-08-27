#let itemplate(
  title: "Document",
  lang: "en",
  body,
  enable_mathjax: true,
  enable_three_js: false,
  importmap: "",
) = {
  html.elem("html", attrs: (lang: lang))[
    #html.elem("head")[
      #html.elem("meta", attrs: (charset: "utf-8"))[]
      #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1.0"))[]
      #html.elem("title")[#title]
      #html.elem("link", attrs: (rel: "stylesheet", href: "https://at.alicdn.com/t/c/font_5215219_v2x8fivud1r.css"))[]
      #html.elem("link", attrs: (
        rel: "stylesheet",
        href: "https://unpkg.com/@hexiongwu1995/itemplate/styles/style.css",
      ))[]
      #html.elem("script", attrs: (src: "https://unpkg.com/@hexiongwu1995/itemplate/scripts/script.js", defer: ""))[]
      #html.elem("script", attrs: (src: "https://unpkg.com/mathjax@4/startup.js", defer: ""))[]
      #html.elem("script", attrs: (type: "importmap"))[]
    ]

    #html.elem("body")[
      #body
    ]
  ]
}

