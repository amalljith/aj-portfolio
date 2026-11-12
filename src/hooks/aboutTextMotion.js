// Section-local adaptations of Codrops' Cursor Scramble, Proofread, Swipe and Overtype:
// https://github.com/codrops/TextCharacterAnimations/tree/main/js/variations
// Keep final glyph advances fixed; only decorative guesses/corrections move.
const decoration = (parent, className, text = "") => {
  const node = document.createElement("span");
  node.className = className;
  node.setAttribute("aria-hidden", "true");
  node.textContent = text;
  parent.append(node);
  return node;
};

const splitCharacters = (element, SplitText, splits) => {
  const split = SplitText.create(element, { type: "words,chars", charsClass: "about__type-char" });
  splits.push(split);
  return split.chars;
};

const position = (node, origin, after = false) => {
  const box = node.getBoundingClientRect();
  return { x: (after ? box.right : box.left) - origin.left, y: box.top - origin.top };
};

export function cursorLabel(element, gsap, SplitText, splits, artifacts) {
  const chars = splitCharacters(element, SplitText, splits);
  const origin = element.getBoundingClientRect();
  const stops = chars.map((char) => position(char, origin));
  const caret = decoration(element, "about__type-caret about__type-caret--block");
  const guesses = decoration(element, "about__type-guesses");
  artifacts.push(caret, guesses);
  const state = { head: 0 };
  const symbols = "/+01>_";
  gsap.set(chars, { opacity: 0 });
  gsap.set([caret, guesses], { opacity: 0 });
  return gsap.timeline({ paused: true, onComplete: () => { caret.remove(); guesses.remove(); } })
    .to(state, {
      head: chars.length, duration: 0.48, ease: "none",
      onUpdate: () => {
        const head = Math.floor(state.head);
        chars.forEach((char, index) => { char.style.opacity = index < head ? "1" : "0"; });
        const spot = stops[Math.min(head, chars.length - 1)];
        gsap.set(caret, { ...spot, opacity: head < chars.length ? 1 : 0 });
        const next = stops[head + 1];
        guesses.textContent = next ? symbols[Math.floor(state.head * 3) % symbols.length] : "";
        if (next) gsap.set(guesses, { ...next, opacity: 0.35 });
      },
      onComplete: () => gsap.set(chars, { opacity: 1 }),
    });
}

export function proofreadIntro(element, gsap, SplitText, splits, artifacts) {
  const lines = [...element.querySelectorAll("[data-about-intro]")].map((line) => splitCharacters(line, SplitText, splits));
  const origin = element.getBoundingClientRect();
  const caret = decoration(element, "about__type-caret");
  artifacts.push(caret);
  const color = getComputedStyle(element).color;
  const accent = getComputedStyle(element).getPropertyValue("--accent").trim();
  // Two predictable neighbouring-key slips; no random changes to the message.
  const mistakes = lines.map((chars, index) => {
    const char = chars.findLast((node) => node.textContent === (index === 0 ? "m" : "e"));
    const final = document.createElement("span");
    final.className = "about__proof-final";
    final.textContent = char.textContent;
    char.replaceChildren(final);
    const slip = decoration(char, "about__proof-slip", index === 0 ? "n" : "r");
    return { char, final, slip };
  });
  gsap.set(lines.flat(), { opacity: 0 });
  gsap.set(mistakes.map(({ final }) => final), { opacity: 0 });
  gsap.set(caret, { opacity: 0 });
  const timeline = gsap.timeline({ paused: true, onComplete: () => {
    caret.remove();
    mistakes.forEach(({ slip }) => slip.remove());
  } });
  let time = 0;
  lines.forEach((chars) => {
    timeline.set(caret, { ...position(chars[0], origin), opacity: 1 }, time);
    chars.forEach((char) => {
      timeline.set(char, { opacity: 1 }, time)
        .set(caret, position(char, origin, true), time);
      time += 0.017;
    });
    time += 0.08;
  });
  time += 0.12;
  mistakes.forEach(({ char, final, slip }) => {
    timeline.to(caret, { ...position(char, origin, true), duration: 0.12, ease: "power2.inOut" }, time);
    time += 0.14;
    timeline.to(slip, { yPercent: 35, opacity: 0, duration: 0.2, ease: "power2.in" }, time)
      .fromTo(final, { yPercent: -35, opacity: 0, color: accent }, { yPercent: 0, opacity: 1, duration: 0.26, ease: "power3.out" }, time)
      .to(final, { color, duration: 0.3, ease: "power1.out" }, time + 0.15);
    time += 0.3;
  });
  timeline.to(caret, { opacity: 0, duration: 0.18 }, time);
  return timeline;
}

export function swipeParagraph(element, gsap, SplitText, splits, artifacts) {
  const split = SplitText.create(element, {
    type: "lines,words,chars", linesClass: "about__swipe-line",
    wordsClass: "about__swipe-word", charsClass: "about__swipe-char",
  });
  splits.push(split);
  const box = element.getBoundingClientRect();
  const em = parseFloat(getComputedStyle(element).fontSize);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("about__swipe-trails");
  element.append(svg);
  artifacts.push(svg);
  gsap.set(split.chars, { opacity: 0.12 });
  const timeline = gsap.timeline({ paused: true, onComplete: () => svg.remove() });
  const rows = ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
  // Reading-order words share a compact 1.15s score. Trails follow keyboard-row
  // contours, but their amplitude/length is reduced for paragraph-sized type.
  const travel = 0.14;
  const spacing = 0.83 / Math.max(1, split.words.length - 1);
  split.words.forEach((word, wordIndex) => {
    const chars = split.chars.filter((char) => word.contains(char));
    const points = chars.map((char) => {
      const rect = char.getBoundingClientRect();
      const row = Math.max(0, rows.findIndex((keys) => keys.includes(char.textContent.toLowerCase())));
      return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + em * (0.68 + row * 0.075) };
    });
    const first = chars[0].getBoundingClientRect();
    const last = chars[chars.length - 1].getBoundingClientRect();
    points.unshift({ x: first.left - box.left, y: points[0].y });
    points.push({ x: last.right - box.left, y: points[points.length - 1].y });
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", points.map(({ x, y }, index) => `${index ? "L" : "M"}${x},${y}`).join(" "));
    svg.append(path);
    const length = path.getTotalLength();
    const dash = Math.min(length, em * 1.4);
    const start = wordIndex * spacing;
    timeline.fromTo(path, { strokeDasharray: `${dash} ${length + em * 3}`, strokeDashoffset: dash, opacity: 0.8 }, { strokeDashoffset: dash - length, duration: travel, ease: "power1.inOut" }, start)
      .to(path, { strokeDashoffset: -length, opacity: 0, duration: 0.1, ease: "power2.out" }, start + travel)
      .to(chars, { opacity: 0.48, duration: 0.06, stagger: travel / Math.max(1, chars.length), ease: "none" }, start)
      .to(chars, { opacity: 1, duration: 0.12, stagger: 0.06 / Math.max(1, chars.length), ease: "power1.out" }, start + travel);
  });
  return timeline;
}

export function overtypeMetadata(element, gsap, SplitText, splits, artifacts) {
  const cursors = [];
  const oldGlyphs = [];
  const timeline = gsap.timeline({ paused: true, onComplete: () => {
    cursors.forEach((node) => node.remove());
    oldGlyphs.forEach((node) => node.remove());
  } });
  [...element.children].forEach((row, rowIndex) => {
    [row.querySelector("[data-about-meta-label]"), row.querySelector("[data-about-meta-value]")].forEach((line, lineIndex) => {
      const chars = splitCharacters(line, SplitText, splits);
      const box = line.getBoundingClientRect();
      const caret = decoration(line, "about__type-caret about__overtype-cursor");
      artifacts.push(caret);
      cursors.push(caret);
      gsap.set(caret, { opacity: 0 });
      const start = rowIndex * 0.4 + lineIndex * 0.22;
      const step = lineIndex ? Math.min(0.022, 0.42 / chars.length) : 0.03;
      const strike = 0.08 * parseFloat(getComputedStyle(line).fontSize);
      chars.forEach((char, index) => {
        const stop = position(char, box, true);
        const final = document.createElement("span");
        final.className = "about__over-final";
        final.textContent = char.textContent;
        char.replaceChildren(final);
        const old = decoration(char, "about__over-old", ["_", "·", "/"][index % 3]);
        oldGlyphs.push(old);
        const at = start + index * step;
        timeline.set(caret, { ...stop, opacity: 1 }, at)
          .fromTo(final, { y: -strike, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, at)
          .to(old, { y: 3, opacity: 0, duration: 0.18, ease: "power2.in" }, at);
      });
      timeline.to(caret, { opacity: 0, duration: 0.12 }, start + chars.length * step + 0.1);
    });
  });
  return timeline;
}
