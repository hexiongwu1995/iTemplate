MathJax = {
  loader: {
    load: ["input/mml", "input/asciimath", "output/chtml"],
  },

  asciimath: {
    delimiters: [["`", "`"]],
  },
};

// 将当前原始 Typst HTML 转换为套用模板的页面
function wrapWithTemplate() {
  // 判断是否使用 online 资源（根据当前页面路径或协议）
  const isOnline = location.protocol === "https:" || location.protocol === "http:";

  const title = document.title || "document";
  const bodyContent = document.body.innerHTML;

  // 更新 title
  document.title = title + "-online";

  // 清空并重建 body 结构
  const originalBodyContent = bodyContent;
  document.body.innerHTML = "";


  
  function loadCss(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);

    const promise = new Promise((resolve, reject) => {
      link.onload = () => {
        resolve(link);
      };
      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${url}`));
      };
    });
    return promise;
  }

  async function appendStyleLink(url) {
    await loadCss(url);
    console.log(`CSS ${url} loaded successfully`);
  }

  const iconFontCssPath = isOnline ? "https://unpkg.com/@hexiongwu1995/itemplate/icon_font/iconfont.css" : "../../dist/icon_font/iconfont.css";

  const styleCssPath = isOnline ? "https://unpkg.com/@hexiongwu1995/itemplate/styles/style.css" : "../../dist/styles/style.css";

  const cssLoaded = Promise.all([
    appendStyleLink(iconFontCssPath),
    appendStyleLink(styleCssPath),
  ]);

  // 添加 MathJax
  const mathjaxScript = document.createElement("script");
  mathjaxScript.src = "https://unpkg.com/mathjax@4/startup.js";
  mathjaxScript.defer = true;
  document.head.appendChild(mathjaxScript);

  // 添加 importmap
  const importMapScript = document.createElement("script");
  importMapScript.type = "importmap";
  importMapScript.textContent = JSON.stringify({
    imports: {
      three: "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/",
    },
  });
  document.head.appendChild(importMapScript);

  // 构建模板 DOM 结构
  const container = document.createElement("div");
  container.className = "container";

  container.innerHTML = `
    <aside>
      <div class="function-panel">
        <span class="aside-title">${title}</span>
        <span class="function-item">
          <span class="iconfont icon-Numbering">标题序号</span>
          <span class="iconfont icon-expand-all">展开目录</span>
        </span>
      </div>
      <nav>
        <ol id="toc-root"></ol>
      </nav>
      <div id="resize-handle"></div>
    </aside>
    <div class="overlay"></div>
    <main>
      <header>
        <span class="header-left">
          <span class="iconfont icon-Aside"></span>
          <span class="iconfont icon-menu3"></span>
        </span>
        <span class="header-middle"> </span>
        <span class="header-right">
          <a class="iconfont-home">
            <span class="iconfont icon-home"></span>
          </a>
          <a class="iconfont-github" href="https://github.com/hexiongwu1995/" target="_blank">
            <span class="iconfont icon-github"></span>
          </a>
          <a class="iconfont-print" href="#">
            <span class="iconfont icon-print"></span>
          </a>
          <span class="iconfont icon-paintbrush"></span>
        </span>
      </header>
      <article>${originalBodyContent}</article>
    </main>
  `;

  document.body.appendChild(container);

  console.log("✅ 已自动套用模板");

  return cssLoaded;
}

// 自动套用模板
const templateReady = wrapWithTemplate();

function getLevel(heading) {
  return parseInt(heading.tagName[1], 10);
}

// 重新获取关键 DOM 引用

const article = document.querySelector("article");

let headings = [];

// 给每个 heading 生成id、添加numbering和data-original-text属性
function initHeadings() {
  headings = Array.from(article.querySelectorAll("h2, h3, h4"));

  const counters = [];

  if (headings.length > 0) {
    headings.forEach((heading) => {
      const level = getLevel(heading);

      // 确保数组有足够的长度
      while (counters.length < level - 1) {
        counters.push(0);
      }
      // 截断到当前层级
      counters.length = level - 1;
      // 当前层级计数+1（用 level-2 作为索引）
      counters[level - 2] = counters[level - 2] + 1;

      const id = counters.join("-");
      heading.id = "heading-" + id;

      const numbering = counters.join(".");

      heading.setAttribute("data-original-text", heading.textContent);
      heading.setAttribute("data-numbering", numbering);
    });
  }
}

const tocRoot = document.getElementById("toc-root");

// 保存 heading 与 TOC 中 <a> 元素的映射，用于后续更新文本而不重建结构
const tocLinkMap = new Map();

function buildToc() {
  if (headings.length === 0) return;

  tocRoot.innerHTML = "";
  tocLinkMap.clear();

  const stack = [{ level: getLevel(headings[0]), ol: tocRoot }];

  headings.forEach((heading, index) => {
    const currentLevel = getLevel(heading);

    const arrow = document.createElement("span");
    arrow.classList.add("iconfont", "icon-arrow2");

    // 新建一个li元素，用于承载当前的heading元素
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + heading.id;

    // 保存映射关系，方便后续更新文本
    tocLinkMap.set(heading, a);

    // 判断当前 heading 后面是否存在层级更深的子 heading
    const nextHeading = headings[index + 1];
    const hasChildren = nextHeading && getLevel(nextHeading) > currentLevel;

    if (hasChildren) {
      a.appendChild(arrow);
    }
    li.appendChild(a);

    // 如果栈顶的heading level 大于 当前的heading level，让栈顶回退到栈顶level等于当前heading level的状态
    while (stack[stack.length - 1].level > currentLevel) {
      stack.pop();
    }

    if (currentLevel > stack[stack.length - 1].level) {
      // 如果当前的heading level 大于栈顶的heading level

      // 新建一个空的ol元素，挂在栈顶的ol元素的最后一个li元素下
      const newOl = document.createElement("ol");
      const parentLi = stack[stack.length - 1].ol.lastElementChild;
      if (parentLi) {
        parentLi.appendChild(newOl);
      }

      // 将当前的heading level 和 新建的ol元素压到栈顶
      stack.push({ level: currentLevel, ol: newOl });
    }

    // 将li元素添加到栈顶的ol元素下
    stack[stack.length - 1].ol.appendChild(li);
  });

  updateTocText();
}

const root = document.documentElement;

// 只更新 TOC 和 heading 的文本内容，不重建 DOM 结构
function updateTocText() {
  if (headings.length === 0) return;

  const enableNumbering = getComputedStyle(root).getPropertyValue("--enable-numbering").trim();

  headings.forEach((heading) => {
    const a = tocLinkMap.get(heading);

    // 保留 arrow 元素，只更新文本部分
    const arrow = a.querySelector(".icon-arrow2");

    if (enableNumbering === "false") {
      a.innerHTML = "";
      a.textContent = heading.getAttribute("data-original-text");
      if (arrow) {
        a.appendChild(arrow);
      }
    } else if (enableNumbering === "true") {
      a.innerHTML = "";
      a.textContent = heading.getAttribute("data-numbering") + ". " + heading.getAttribute("data-original-text");
      if (arrow) {
        a.appendChild(arrow);
      }
    } else {
      console.log(enableNumbering);
      console.log(new Error("--enable-numbering must be true or false"));
    }

    // let newText;
    // if (enableNumbering === "true") {
    //   newText = heading.getAttribute("data-numbering") + ". " + heading.getAttribute("data-original-text");
    // } else {
    //   newText = heading.getAttribute("data-original-text");
    // }

    // heading.textContent = newText;

    // 更新或创建文本节点
    // if (a.childNodes.length > 0 && a.childNodes[0].nodeType === Node.TEXT_NODE) {
    //   a.childNodes[0].nodeValue = newText;
    // } else {
    //   a.insertBefore(document.createTextNode(newText), a.firstChild);
    // }

    // 确保 arrow 仍在 a 中
    // if (arrow && !a.contains(arrow)) {
    //   a.appendChild(arrow);
    // }
  });
}

templateReady.then(() => {
  initHeadings();
  buildToc();
});

// 显示/隐藏目录编号
const toggleNumbering = document.querySelector(".icon-Numbering");

if (toggleNumbering) {
  toggleNumbering.addEventListener("click", () => {
    const enableNumbering = getComputedStyle(root).getPropertyValue("--enable-numbering").trim();
    const toggleNumbering = enableNumbering === "true" ? "false" : "true";
    root.style.setProperty("--enable-numbering", toggleNumbering);

    updateTocText();
  });
}

// 点击arrow切换目录展开状态
const nav = document.querySelector("nav");
if (nav) {
  nav.addEventListener("click", (e) => {
    const arrow = e.target.closest(".icon-arrow2");
    if (!arrow) return;

    e.preventDefault();
    e.stopPropagation();

    const li = arrow.closest("li");
    const nestedOl = li.querySelector(":scope > ol");

    if (!nestedOl) return;

    nestedOl.classList.toggle("show");
    arrow.classList.toggle("rotate-90");
  });
}

// 展开/收起 所有目录
const iconExpand = document.querySelector(".icon-expand-all");

if (iconExpand) {
  iconExpand.addEventListener("click", () => {
    const ol = tocRoot.querySelectorAll("ol");
    const arrows = tocRoot.querySelectorAll(".icon-arrow2");
    const allExpandedValue = getComputedStyle(root).getPropertyValue("--all-expanded").trim();
    const newAllExpanded = allExpandedValue === "false" ? "true" : "false";
    root.style.setProperty("--all-expanded", newAllExpanded);

    if (newAllExpanded === "true") {
      ol.forEach((item) => {
        item.classList.add("show");
      });
      arrows.forEach((arrow) => {
        arrow.classList.add("rotate-90");
      });
    } else if (newAllExpanded === "false") {
      ol.forEach((item) => {
        item.classList.remove("show");
      });
      arrows.forEach((arrow) => {
        arrow.classList.remove("rotate-90");
      });
    } else {
      alert("展开/收起所有目录失败");
    }
  });
}

// 大屏状态下 显示/隐藏 侧边栏
const iconAside = document.querySelector(".icon-Aside");
const aside = document.querySelector("aside");
const main = document.querySelector("main");

if (iconAside) {
  iconAside.addEventListener("click", () => {
    main.classList.toggle("hidden");
    iconAside.classList.toggle("hidden");
    aside.classList.toggle("hidden");
  });
}

// 小屏状态下 显示/隐藏 侧边栏
const iconMenu3 = document.querySelector(".icon-menu3");
const overlay = document.querySelector(".overlay");

if (iconMenu3) {
  iconMenu3.addEventListener("click", () => {
    iconMenu3.classList.toggle("show");
    aside.classList.toggle("show");
    overlay.classList.toggle("show");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    iconMenu3.classList.remove("show");
    aside.classList.remove("show");
    overlay.classList.remove("show");
  });
}

// 侧边栏宽度调整
const resizeHandle = document.querySelector("#resize-handle");

if (resizeHandle) {
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  const minWidth = 0;
  const maxWidth = 500;

  resizeHandle.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    const currentWidth = parseInt(getComputedStyle(root).getPropertyValue("--aside-width").trim(), 10);
    startWidth = currentWidth;
    resizeHandle.classList.add("resizing");
    aside.classList.add("resizing");
    main.classList.add("resizing");
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    const delta = e.clientX - startX;
    let newWidth = startWidth + delta;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    root.style.setProperty("--aside-width", newWidth + "px");
  });

  document.addEventListener("mouseup", () => {
    if (!isResizing) return;
    isResizing = false;
    resizeHandle.classList.remove("resizing");
    aside.classList.remove("resizing");
    main.classList.remove("resizing");
    document.body.style.userSelect = "";
  });
}