var confettiSettings = {
  target: "my-canvas",
  props: [
    "circle",
    "square",
    // "triangle",
    "line",
    { type: "svg", src: "heart4.svg", size: 24, weight: 0.5 },
    { type: "svg", src: "heart3.svg", size: 10, weight: 0.4 },
  ],
  colors: [
    [255, 219, 222],
    [255, 194, 199],
    [207, 213, 255],
  ],
  clock: "16",
  rotate: true,
  respawn: true,
};
var confetti = new ConfettiGenerator(confettiSettings);
confetti.render();

var textWrapper = document.querySelector(".text");
textWrapper.innerHTML = textWrapper.textContent.replace(
  /\S/g,
  "<span class='letter'>$&</span>"
);

anime.timeline().add({
  targets: ".text .letter",
  opacity: [0, 1],
  easing: "easeInOutQuad",
  duration: 800,
  delay: (el, i) => 150 * (i + 1),
});
