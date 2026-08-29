#let itemplate(
  title: "Document",
  lang: "en",
  body,
) = {
  html.elem("html", attrs: (lang: lang))[
    #html.elem("head")[
      #html.elem("meta", attrs: (charset: "utf-8"))[]
      #html.elem("meta", attrs: (name: "viewport", content: "width=device-width, initial-scale=1.0"))[]
      #html.elem("title")[#title]
      // #html.elem("script", attrs: (src: "https://unpkg.com/@hexiongwu1995/itemplate/scripts/script.js", defer: ""))[]
      #html.elem("script", attrs: (src: "../../dist/scripts/script.js", defer: ""))[]
      #html.elem("style")[
        html {display: none;}
        html.loaded { display: block; }
      ]
    ]
    #html.elem("body")[
      #body
    ]
  ]
}

