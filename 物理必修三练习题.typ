#import "@preview/theoframe:0.3.7": *
#show: theoframe-setup.with(theme: (style: "box", color: rgb("#067300")))

#import "@preview/zero:0.7.0": num as number, set-num as set-number, zi
#import "@preview/unify:0.8.1": *

#import "@preview/invaria:0.2.0"
#import invaria.codata2022.universal: *
#import invaria.codata2022.atomic-and-nuclear: *
#import invaria.codata2022.electromagnetic: *


#set page(paper: "a4", margin: 2cm)
#set heading(numbering: "1.")
#set text(lang: "zh")
#set-number(digits: 2, exponent: "sci")
#import "@preview/cetz:0.5.2"

#show figure: set block(breakable: true)
// #set block(breakable: true)

= 静电力计算

#example(
  name: [在氢原子内，氢原子核与电子之间的最短距离为$5.3 times 10^(-11)$  m。试比较氢原子核与电子之间的静电力和万有引力。],
)[
  #let r = 5.3e-11

  万有引力：
  #let FG = newtonian-constant-of-gravitation.val * proton-mass.val * electron-mass.val / calc.pow(r, 2)
  $
    F_G &= (G m_p m_e)/r^2 \
    &= (#qty("6.67e-11", newtonian-constant-of-gravitation.unit) times #qty("1.67e-27", proton-mass.unit) times #qty("9.11e-31", electron-mass.unit) )/(5.3 times 10^(-11) "m")^2 \
    &= #number(FG) "N"
  $

  #let coulomb-constant = 1 / (4 * calc.pi * vacuum-electric-permittivity.val)
  #let FE = coulomb-constant * elementary-charge.val * elementary-charge.val / calc.pow(r, 2)

  静电力：
  $
    F_E & = ( k_e Q_p Q_e )/ r^2 \
    & =( #number(coulomb-constant) "m""F"^(-1) times #number(elementary-charge.val) "C" times #number(elementary-charge.val) "C" )/ (#number(r)"m")^2 \
    &= #number(FE) "N" \
  $

  静电力与万有引力之比：
  $ F_E / F_G = #number(FE / FG) $
]


#example(
  name: [真空中有三个带正电的点电荷，它们固定在边长为 50 cm 的等边三角形的三个顶点上，每个点电荷的电荷量都是 $2.0 times 10^(-6)$ C，求它们各自所受的静电力。],
)[
  #set align(center)
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
  $ arrow(F)_"total" &= arrow(F)_(13) + arrow(F)_(23) \ &= sqrt(3) |arrow(F)_(13)| \ &= #calc.round( calc.sqrt(3) * F, digits: 2) "N" $

  如图所示，$arrow(F)_"total"$的方向为向外的角平分线方向。 \ 
  由对称关系可知 q1 和 q2的静电力合力的大小等于$arrow(F)_"total"$的大小，方向为各自所在点处向外的角平分线方向。
]


