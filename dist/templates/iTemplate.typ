#let itemplate(
  title: "Document",
  lang: "en",
  body,
) = {
  html.html(lang: lang)[
    #html.head()[
      #html.meta(
        charset: "utf-8",
      )

      #html.meta(
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      )

      #html.title(title)

      #html.script(
        type: "importmap",
        ```
        {
          "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/"
          }
        }
        ```.text,
      )
      #html.script(src: "../../dist/scripts/script.js", defer: true)
      #html.style(
        ```css
        html {display: none;}
        html.loaded { display: block; }
        ```.text,
      )
    ]
    #html.body(body)
  ]
}
