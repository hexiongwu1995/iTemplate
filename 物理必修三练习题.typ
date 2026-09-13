#import "@preview/itemplate:0.1.0": *
#show: contents => itemplate(doc-title: "物理必修三练习题", doc-author: "HeXiongwu", contents)


#import "@preview/theoframe:0.3.7": *
#show: theoframe-setup.with(theme: (style: "box", color: rgb("#067300")))

#import "@preview/zero:0.7.0": num as number, set-num as set-number, zi
#set-number(digits: 2, exponent: "sci")
#import "@preview/unify:0.8.1": *

#import "@preview/invaria:0.2.0"
#import invaria.codata2022.universal: *
#import invaria.codata2022.atomic-and-nuclear: *
#import invaria.codata2022.electromagnetic: *

// #set page(paper: "a4", margin: 2cm)
// #set heading(numbering: "1.")
#set text(lang: "zh")
#import "@preview/cetz:0.5.2"



#show figure: set block(breakable: true)
#show math.equation: set block(breakable: true)

// #import "@preview/cetz:0.5.2": canvas as _cetz-canvas
// #let cetz-canvas(..args) = {
//   if sys.inputs.at("format", default: "pdf") == "html" {
//     html.elem("div", html.frame(_cetz-canvas(..args)), attrs: (class: "typst-diagram"))
//   } else {
//     _cetz-canvas(..args)
//   }
// }




#show figure.where(kind: "cetz"): it => {
  if (target() == "bundle" or target() == "html") {
    html.elem("div", attrs: (style: "width: 100%; margin: 10pt auto; display: flex; justify-content: center", class: "typst-diagram"), html.frame(it))
  } else { it }
}





= 静电力计算

#example(
  name: [在氢原子内，氢原子核与电子之间的最短距离为$5.3 times 10^(-11)$  m。试比较氢原子核与电子之间的静电力和万有引力。],
)[
  #let r = 5.3e-11

  万有引力：
  #let FG = newtonian-constant-of-gravitation.val * proton-mass.val * electron-mass.val / calc.pow(r, 2)
  //  &= (#qty("6.67e-11", newtonian-constant-of-gravitation.unit) times #qty("1.67e-27", proton-mass.unit) times #qty("9.11e-31", electron-mass.unit) )/(5.3 times 10^(-11) "m")^2 \
  $
    F_G & = (G m_p m_e)/r^2 \
        & = #number(FG) "N" \
  $

  #let coulomb-constant = 1 / (4 * calc.pi * vacuum-electric-permittivity.val)
  #let FE = coulomb-constant * elementary-charge.val * elementary-charge.val / calc.pow(r, 2)

  //     & =( #number(coulomb-constant) "m""F"^(-1) times #number(elementary-charge.val) "C" times #number(elementary-charge.val) "C" )/ (#number(r)"m")^2 \

  静电力：
  $
    F_E & = ( k_e Q_p Q_e )/ r^2 \
        & = #number(FE) "N" \
  $

  静电力与万有引力之比：
  $ F_E / F_G = #number(FE / FG) $
]


#example(
  name: [真空中有三个带正电的点电荷，它们固定在边长为 50 cm 的等边三角形的三个顶点上，每个点电荷的电荷量都是 $2.0 times 10^(-6)$ C，求它们各自所受的静电力。],
)[
  #set align(center)

  #figure(
    caption: [位于等边三角形三个顶点处的电荷],
    numbering: "1.",
    kind: "cetz",
    supplement: none,
  )[
    #cetz.canvas(length: 1.5cm, {
      import cetz.draw: *
      // Your drawing code goes here
      let (Q1, Q2, Q3) = ((0, calc.sqrt(3)), (-1, 0), (1, 0))
      let P23 = (rel: (1, 0), to: Q3)
      let P13 = (rel: (-60deg, 1), to: Q3)
      let Pend = (rel: (1, 0), to: P13)
      line(Q1, Q2, Q3, close: true)
      content(Q1, [q1], anchor: "south", padding: 10pt)
      content(Q2, [q2], anchor: "east", padding: 10pt)
      content(Q3, [q3], anchor: "south", padding: 10pt)

      content(P13, [F13], anchor: "north", padding: 5pt)
      content(P23, [F23], anchor: "south", padding: 5pt)
      content(Pend, [$F_"total"$], anchor: "north-west", padding: 5pt)

      set-style(mark: (fill: red, scale: 1))
      set-style(line: (stroke: red))
      line(Q3, P23, mark: (end: "stealth"), name: "F23")
      line(Q3, P13, mark: (end: "stealth"), name: "F13")
      line(Q3, Pend, mark: (end: "stealth"), name: "Fpend")
      line(P13, Pend, P23, stroke: (dash: "dotted"))

      set-style(content: (frame: "circle", stroke: none, fill: luma(80%), padding: 1pt))
      content(Q1, [+], anchor: "center")
      content(Q2, [+], anchor: "center")
      content(Q3, [+], anchor: "center")
    })
  ]

  #set align(left)
  如上图所示: 由于 q1, q2 和 q3所处的空间位置呈现出特定的对称关系，而且每个点电荷的电荷量都相等，从图示可以看出，q1, q2和q3的静电力大小都相等，仅方向不同。

  取q3作为研究对象，记它受到来自q1的力为$arrow(F)_(13)$，记它受到来自q2的力为$arrow(F)_(23)$，力的方向如图所示。
  #let Q = 2e-6;
  #let r = 0.5;
  #let coulomb-constant = 1 / (4 * calc.pi * vacuum-electric-permittivity.val)
  #let F = coulomb-constant * Q * Q / calc.pow(r, 2)
  $
    |arrow(F)_(13)| = |arrow(F)_(23)| & = k_e Q^2 / r^2 \
    & = #number(coulomb-constant) "m""F"^(-1) times (#number(Q) "C")^2 / (#number(r)"m")^2 \
    &= #calc.round(F, digits: 3) "N"
  $

  记 q3受到的静电力合力为$arrow(F)_"total"$，由图中的几何关系可知：
  $
    arrow(F)_"total" & = arrow(F)_(13) + arrow(F)_(23) \
                     & = sqrt(3) |arrow(F)_(13)| \
                     & = #calc.round(calc.sqrt(3) * F, digits: 2) "N"
  $

  如图所示，$arrow(F)_"total"$的方向为向外的角平分线方向。 \
  由对称关系可知 q1 和 q2的静电力合力的大小等于$arrow(F)_"total"$的大小，方向为各自所在点处向外的角平分线方向。
]


// #html.elem("div", diagram1, attrs: (class: "typst-diagram"))
// #html.frame(diagram1)





#problem(name: [有三个完全相同的金属球，球A 带的电荷量为q，球B 和球C 均不带电。现要使球B 带
  的电荷量为 $(3 q) / 8$ ，应该怎么操作？])[
  $
    (3 q) / 8 & = ( (2 q) / 8 + ( 4 q)/8 ) /2 \
              & = ( q/ 4 + q/2)/2
  $
  先让球A与B接触，使球A和球B带电 $q / 2$，再让球B与C接触，使球B和球C带电 $q / 4$，再让球B与球A接触，使球A和球B带电 $(3 q) / 8$。
]


#problem(name: [ 半径为r  的两个金属球，其球心相距3r，现使两球带上等量的同种电荷Q，两球之间的
  静电力$F = k Q^2 / (9 r^2)$吗？说明理由。])[
  - 由于两球距离仅为半径的三倍，不可使用点电荷模型。
  - 由于静电感应，而且同种电荷相互排斥，电荷分布会集中在两球外侧（相背的一面）。使得电荷之间的等效距离大于3r，从而导致静电力小于$F = k Q^2 / (9 r^2)$。
]

#problem(name: [真空中两个相同的带等量异种电荷的金属小球A 和B（均可看作点电荷），分别固定在
  两处，两球之间的静电力为F。现用一个不带电的同样的金属小球C 先与A 接触，再与B 接触，然后移开C，此时A、B 之间的静电力变为多少？若再使A、B 之间距离增大为原来的2倍，则它们之间的静电力又为多少？])[
  设接触前 $Q_A = Q$，$Q_B = -Q$，$Q_C = 0$，$F_"AB" = - k Q^2 / d_"AB"^2$ \
  + 球C与A接触后：$Q_A^' = Q_C^' = Q/2$，$Q_B^' = -Q$ \
  + 球C与B接触后：$Q_A^'' = Q/2$，$Q_B^''= Q_C^'' = -Q/4$ \
    此时的静电力为$F_"AB"^'' = - k Q^2 / (8 d_"AB"^2 ) = 1/8 F_"AB"$
  + 如果再将A、B 之间距离增大为原来的2倍，即：$d_"AB"^''' = 2 d_"AB"$
    则：$F_"AB"^''' = 1 / 32 F_"AB"$
]


#problem(
  name: [在边长为a 的正方形的每个顶点都放置一个电荷量为q 的同种点电荷。如果保持它们的位置不变，每个电荷受到其他三个电荷的静电力的合力是多少？],
)[
  #set align(center)

  #figure(
    caption: [位于正方形四个顶点处的电荷],
    numbering: "1.",
    kind: "cetz",
    supplement: none,
  )[
    #cetz.canvas(length: 1cm, {
      import cetz.draw: *
      let (p1, p2, O, p3, p4) = ((-1, -1), (1, -1), (0, 0), (1, 1), (-1, 1))
      let p12 = (rel: (0deg, 2), to: p2)
      let p32 = (rel: (-90deg, 2), to: p2)
      let p1232 = (rel: (-45deg, 2 * calc.sqrt(2)), to: p2)
      let p42 = (rel: (-45deg, calc.sqrt(2)), to: p2)
      let p-total = (rel: (-45deg, 3 * calc.sqrt(2)), to: p2)
      line(p1, p2, p3, p4, close: true)
      content(p1, [q1], anchor: "north", padding: 5pt)
      content(p2, [q2], anchor: "north-east", padding: 5pt)
      content(p3, [q3], anchor: "south", padding: 5pt)
      content(p4, [q4], anchor: "south", padding: 5pt)
      set-style(line: (stroke: (paint: red, dash: "dotted")), mark: (fill: red, scale: 1))
      line(p2, p12, mark: (end: "stealth"))
      line(p2, p32, mark: (end: "stealth"))
      line(p2, p42, mark: (end: "stealth"))
      line(p2, p-total, stroke: (paint: luma(50%), dash: "solid"), mark: (end: "stealth", fill: luma(50%)))
      content(p12, $arrow(F)_(12)$, anchor: "south", padding: 5pt)
      content(p32, $arrow(F)_(32)$, anchor: "east", padding: 5pt)
      content(p42, $arrow(F)_(42)$, anchor: "north-east", padding: 5pt)
      content(p-total, $arrow(F)_"total"$, anchor: "north-east", padding: 5pt)
      line(p12, p1232, p32, stroke: (paint: orange, dash: "dotted"))
      line(p2, p1232, stroke: (paint: orange, dash: "dotted"), mark: (end: "stealth"))
      content(p1232, $arrow(F)_(1232)$, anchor: "west", padding: 5pt)
    })
  ]




  #set align(left)
  因为：
  q1 = q2 = q3 = q4 = q \
  $ |arrow(F)_(12)| = |arrow(F)_(32)| = k q^2 / a^2 $ \
  $ |arrow(F)_(42)| = k q^2 / (2 a^2) $ \
  $
    arrow(F)_(1232) & = arrow(F)_(12) + arrow(F)_(32) \
                    & = sqrt(2) dot k q^2 / a^2
  $
  $
    arrow(F)_"total" & = arrow(F)_(1232) + arrow(F)_(42) \
                     & = (sqrt(2) + 1/2) dot k q^2 / a^2
  $
  q2受到的合力大小为$arrow(F)_"total"$的大小，方向如图所示，沿着q2位置的外角平分线方向。
  由对称关系可知其余三个电荷的受力情况。
]


#problem(
  name: [ 两个分别用长13 cm 的绝缘细线悬挂于同一点的相同小球（可看作质点），带有同种等量电荷。由于静电力F 的作用，它们之间的距离为 10cm。已测得每个小球的质量是0.6 g，求它们各自所带的电荷量。g 取10 m/s2。],
)[
  #set align(center)

  #figure(
    caption: [悬挂在绝缘细线上的带电小球],
    numbering: "1.",
    kind: "cetz",
    supplement: none,
  )[
    #cetz.canvas(length: 4cm, {
      import cetz.draw: *
      let O = (0, 0)
      let (p1, p3) = ((-0.5, 0), (0.5, 0.05))
      let (b1, b2) = ((-0.5, -1.2), (0.5, -1.2))
      let c = (0, -1.2)
      line(O, c, stroke: (paint: luma(50%), thickness: 1pt, dash: "dotted"))
      content(O, [O], anchor: "south", padding: 5pt)
      content(c, [c], anchor: "east", padding: 5pt)

      // fill:gradient.linear(luma(80%), luma(20%)),
      // stroke:(bottom:(paint:black, thickness:1pt))
      rect(p1, p3, fill: gradient.linear(dir: ttb, luma(90%), luma(60%)), stroke: none)
      set-style(line: (stroke: (paint: rgb("#048e6098"), dash: "solid")))
      line(O, b1)
      line(O, b2)
      set-style(circle: (
        fill: gradient.radial(luma(90%), luma(60%)),
        stroke: (paint: luma(50%), thickness: 1pt, dash: "solid"),
      ))
      circle(b1, radius: 0.1, name: "ball1")
      circle(b2, radius: 0.1, name: "ball2")
      set-style(line: (stroke: black + 1pt))
      line(
        (rel: (0, -0.1), to: "ball1.south"),
        (rel: (0, -0.1), to: "ball2.south"),
        mark: (symbol: "stealth", fill: black),
        name: "distance",
      )

      line((rel: (0, -0.05), to: "distance.start"), (rel: (0, 0.05), to: "distance.start"))
      line((rel: (0, -0.05), to: "distance.end"), (rel: (0, 0.05), to: "distance.end"))
      content("distance", [10cm], anchor: "north", padding: 5pt)
      set-style(line: (stroke: red, mark: (end: (symbol: "stealth", fill: red))))
      line(b1, (rel: (-0.25, 0), to: b1), name: "F1")
      line(b2, (rel: (0.25, 0), to: b2), name: "F2")
      content("F1.end", $arrow(F)$, anchor: "east", padding: 5pt)
      content("F2.end", $arrow(F)$, anchor: "west", padding: 5pt)
      set-style(
        line: (stroke: (paint: luma(50%), dash: "densely-dotted")),
        mark: (end: (symbol: "stealth", fill: black)),
      )
      line((rel: (-0.5, 0), to: b2), (rel: (1, 0), to: b2), name: "x", mark: (end: (symbol: "stealth", fill: black)))
      line((rel: (0, -1), to: b2), (rel: (0, 1), to: b2), name: "y", mark: (end: (symbol: "stealth", fill: black)))
      content("x.end", [x], anchor: "west", padding: 5pt)
      content("y.end", [y], anchor: "south", padding: 5pt)

      let b2O-middle = ((b2.at(0) + O.at(0)) / 2, (b2.at(1) + O.at(1)) / 2)
      line(b2, b2O-middle, name: "Fp")
      content("Fp.end", $arrow(F)_p$, anchor: "east", padding: 5pt)
      let py = (b2.at(0), b2O-middle.at(1))
      let px = (b2O-middle.at(0), b2.at(1))
      line(b2, px, name: "Fx")
      line(b2, py, name: "Fy")
      content("Fx.end", $arrow(F)_x$, anchor: "north", padding: 5pt)
      content("Fy.end", $arrow(F)_y$, anchor: "west", padding: 5pt)
      set-style(line: (stroke: (paint: luma(50%), dash: "densely-dotted"), mark: none))
      line(px, b2O-middle, py)
      let pg = (rel: (0, -0.6), to: b2)
      line(b2, pg, mark: (end: (symbol: "stealth", fill: luma(50%))), name: "Fg")
      content("Fg.end", $arrow(F)_g$, anchor: "west", padding: 5pt)
      content(b2, [b], frame: "circle", stroke: none, fill: gradient.radial(luma(90%), luma(60%)), padding: 5pt)
    })
  ]



  #set align(left)
  因为：$F_g = m g$ \
  由相似三角形可知：\
  $ (|arrow(F)|)/"cb" = (|arrow(F)_g|)/"Oc" $
  $
    => |arrow(F)| & = |arrow(F)_g| * "cb" / "Oc" \
                  & = m g * "cb" / "Oc" \
                  & = 0.6 upright(g) * 10 upright(m s^(-2)) * 5 / 12 \
                  & = 2.5 times 10^(-3) "N"
  $

  #let F = 2.5e-3;
  #let r = 0.1;
  #let k = 1 / (4 * calc.pi * vacuum-electric-permittivity.val)
  #let q = calc.sqrt((F * calc.pow(r, 2)) / k)

  由库伦定律得：
  $ F = k q^2 / r^2 $

  则，电荷量：
  $
    q & = sqrt((F r^2)/ k) \
      & = #number(q) "C"
  $
]


