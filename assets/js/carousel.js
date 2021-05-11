class Carousel {
  constructor(params) {
    let settings = this._initConfig(params);
    this.container = document.querySelector(settings.containerID);
    this.slides = this.container.querySelectorAll(settings.slideID);
    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }
  _initConfig(o) {
    let p = {
      containerID: "#carousel",
      slideID: ".slide",
      interval: 2000,
      isPlaying: true,
    };
    return { ...p, ...o };
  }
  _initProps() {
    this.CODE_SPACE = "Space";
    this.CODE_ARROW_LEFT = "ArrowLeft";
    this.CODE_ARROW_RIGHT = "ArrowRight";

    this.FA_PAUSE = `<i class="fas fa-pause"></i>`;
    this.FA_PLAY = `<i class="fas fa-play"></i>`;
    this.FA_PREV = `<i class="fas fa-chevron-left"></i>`;
    this.FA_NEXT = `<i class="fas fa-chevron-right"></i>`;

    this.slideCount = this.slides.length;
    this.currentSlide = 0;
    this.timerId = null;
  }

  _initControls() {
    const controls = document.createElement("div");
    controls.setAttribute("class", "controls");
    const PAUSE = `<div id="pause" class="control">${
      this.isPlaying ? this.FA_PAUSE : this.FA_PLAY
    }</div>`;
    const PREV = `<div id="prev" class="control">${this.FA_PREV}</div>`;
    const NEXT = `<div id="next" class="control">${this.FA_NEXT}</div>`;
    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.appendChild(controls);

    this.pauseBtn = this.container.querySelector("#pause");
    this.prevBtn = this.container.querySelector("#prev");
    this.nextBtn = this.container.querySelector("#next");
  }

  _initIndicators() {
    const indicators = document.createElement("div");
    indicators.setAttribute("class", "indicators");

    for (let i = 0, n = this.slideCount; i < n; i++) {
      const indicator = document.createElement("div");
      indicator.setAttribute("class", "indicator");
      indicator.dataset.slideTo = `${i}`;
      if (i === 0) indicator.classList.add("active");

      indicators.appendChild(indicator);
    }

    this.container.appendChild(indicators);

    this.indicatorsContainer = this.container.querySelector(".indicators");
    this.indicators = this.indicatorsContainer.querySelectorAll(".indicator");
  }
  _initListeners() {
    this.pauseBtn.addEventListener("click", this.pausePlay.bind(this));
    this.prevBtn.addEventListener("click", this.prev.bind(this));
    this.nextBtn.addEventListener("click", this.next.bind(this));
    this.indicatorsContainer.addEventListener(
      "click",
      this.indicate.bind(this)
    );
    document.addEventListener("keydown", this.pressKey.bind(this));
  }

  gotoSlide(n) {
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");

    this.currentSlide = (n + this.slideCount) % this.slideCount;
    this.slides[this.currentSlide].classList.toggle("active");
    this.indicators[this.currentSlide].classList.toggle("active");
  }

  prevSlide() {
    this.gotoSlide(this.currentSlide - 1);
  }

  nextSlide() {
    this.gotoSlide(this.currentSlide + 1);
  }

  prev() {
    this.pause();
    this.prevSlide();
  }

  next() {
    this.pause();
    this.nextSlide();
  }

  pause() {
    if (this.isPlaying) {
      this.pauseBtn.innerHTML = this.FA_PLAY;
      this.isPlaying = false;
      clearInterval(this.timerId);
    }
  }

  play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = true;
    this.timerId = setInterval(() => this.nextSlide(), this.interval);
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  indicate(e) {
    console.log(this);
    const target = e.target;
    if (target && target.classList.contains("indicator")) {
      this.pause();
      this.gotoSlide(+target.dataset.slideTo);
    }
  }

  pressKey(e) {
    console.log(e);
    if (e.code === this.CODE_ARROW_LEFT) this.prev();
    if (e.code === this.CODE_ARROW_RIGHT) this.next();
    if (e.code === this.CODE_SPACE) this.pausePlay();
  }

  init() {
    this._initProps();
    this._initIndicators();
    this._initControls();
    this._initListeners();
    if (this.isPlaying)
      this.timerId = setInterval(() => this.nextSlide(), this.interval);
  }
}
class SwipeCarousel extends Carousel {
  _initListeners() {
    super._initListeners();
    this.container.addEventListener("touchstart", this.swipeStart.bind(this));
    this.container.addEventListener("touchend", this.swipeEnd.bind(this));
  }

  swipeStart(e) {
    this.swipeStartX = e.changedTouches[0].clientX;
  }
  swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].clientX;
    if (this.swipeStartX - this.swipeEndX > 100) this.next();
    if (this.swipeStartX - this.swipeEndX < -100) this.prev();
  }
}
