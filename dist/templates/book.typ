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
      #html.elem("div", attrs: (class: "container"))[
        #html.elem("aside")[
          #html.elem("div", attrs: (class: "function-panel"))[
            #html.elem("span", attrs: (class: "aside-title"))[
              #html.elem("script")[document.write(document.title)]
            ]
            #html.elem("span", attrs: (class: "function-item"))[
              #html.elem("span", attrs: (class: "iconfont icon-Numbering"))[标题序号]
              #html.elem("span", attrs: (class: "iconfont icon-expand-all"))[展开目录]
            ]
          ]
          #html.elem("nav")[
            #html.elem("ol", attrs: (id: "toc-root"))[]
          ]
          #html.elem("div", attrs: (id: "resize-handle"))[]
        ]

        #html.elem("div", attrs: (class: "overlay"))[]

        #html.elem("main")[
          #html.elem("header")[
            #html.elem("span", attrs: (class: "header-left"))[
              #html.elem("span", attrs: (class: "iconfont icon-Aside"))[]
              #html.elem("span", attrs: (class: "iconfont icon-menu3"))[]
            ]
            #html.elem("span", attrs: (class: "header-middle"))[]
            #html.elem("span", attrs: (class: "header-right"))[
              #html.elem("a", attrs: (class: "iconfont-home"))[
                #html.elem("span", attrs: (class: "iconfont icon-home"))[]
              ]
              #html.elem("a", attrs: (
                class: "iconfont-github",
                href: "https://github.com/hexiongwu1995/",
                target: "_blank",
              ))[
                #html.elem("span", attrs: (class: "iconfont icon-github"))[]
              ]
              #html.elem("a", attrs: (class: "iconfont-print", href: "#"))[
                #html.elem("span", attrs: (class: "iconfont icon-print"))[]
              ]
              #html.elem("span", attrs: (class: "iconfont icon-paintbrush"))[]
            ]
          ]
          #html.elem("article")[
            #body
          ]
        ]
      ]
    ]
  ]
}

