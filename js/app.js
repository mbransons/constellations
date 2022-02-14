gsap.registerPlugin(DrawSVGPlugin);
const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
const composition = document.querySelector('.composition');
let lineAnim;

function buildConstellation(obj) {
  let constellation = document.createElement('div');
  constellation.classList.add('constellation');
  constellation.setAttribute('id', obj.slug);
  constellation.innerHTML = `
  <h2 class="constellation-title">${obj.name}</h2>
  ${obj.svg}
  `;
  return constellation;
}

function buildSolSys(arr) {
  arr
    .sort((a, b) => (a.slug > b.slug ? 1 : -1))
    .forEach((constellation) =>
      composition.appendChild(buildConstellation(constellation))
    );
  colorStars();
}

function colorStars() {
  let stars = [...document.querySelectorAll('.star')];
  let starsData = stars.map((star) => {
    let w = star.getBoundingClientRect().width;
    let h = star.getBoundingClientRect().height;
    let area = w * h;
    let starObj = {};
    starObj.area = area;
    starObj.node = star;
    return starObj;
  });
  console.log(starsData);
  let max = Math.max.apply(
    Math,
    starsData.map((star) => star.area)
  );
  let min = Math.min.apply(
    Math,
    starsData.map((star) => star.area)
  );

  let distance = max - min;

  let range = distance / colors.length;

  let rangeArr = colors.map((val, i) => max - range - range * i);

  starsData.forEach((star) => {
    let closest = Math.min.apply(
      Math,
      rangeArr.map((val) => Math.abs(val - star.area))
    );
    let idx = rangeArr.findIndex((val) => closest == Math.abs(val - star.area));
    star.node.style.fill = colors[idx];
  });

  console.log(`max: ${max}
  min: ${min}`);
}

function setLineListeners(constellation) {
  let lines = document.querySelectorAll(`#${constellation} .line`);
  let tl = gsap.timeline();
  tl.set(lines, { visibility: 'visible' }).from(
    lines,
    { duration: 1.33, drawSVG: 0 },
    0.1
  );
  return tl.pause();
}

function init() {
  buildSolSys(constellations);
  //   lineAnim = setLineListeners();
  setConstellationListeners();
}

function setConstellationListeners() {
  let constellationDivs = [...document.querySelectorAll('.constellation')];
  constellationDivs.forEach((constellation, i) => {
    constellation.addEventListener('mouseenter', handleConstellationEvent);
    constellation.addEventListener('mouseleave', handleConstellationEvent);
    constellations[i].lineAnim = setLineListeners(constellations[i].slug);
    // console.log(constellation.slug);
  });
}

function handleConstellationEvent(e) {
  if (e.type === 'mouseenter') {
    let constellation = constellations.find((obj) => obj.slug == e.target.id);
    constellation.lineAnim.play();
  }
  if (e.type === 'mouseleave') {
    let constellation = constellations.find((obj) => obj.slug == e.target.id);
    constellation.lineAnim.restart().pause();
  }
}

init();
