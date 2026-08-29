

#import "../../dist/templates/iTemplate.typ":*
#show: contents => itemplate(contents)


#html.elem("div", attrs: (style: "background: white; margin-top: 50px; width: 100%; height: 30vh", id:"three-orbital-cube"))[
]

#html.script(type:"module", src: "./orbital-cube.js")




