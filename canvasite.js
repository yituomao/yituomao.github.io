/* FROM GLOSSY TO DIGITAL — slide deck interaction
   Wheel / touch / keyboard driven full-screen paging, hero letter reveal,
   and hero media scene cycling. */

(function () {
    "use strict";

    var deck = document.getElementById("deck");
    var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-goto]"));
    var heroVideo = document.querySelector(".hero-layer video");
    var heroTitle = document.getElementById("heroTitle");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var current = 0;
    var locked = false;
    var sceneTimer = null;
    var sceneIndex = 0;
    var heroLayers = Array.prototype.slice.call(document.querySelectorAll(".hero-layer"));

    /* ---------------- deck position ---------------- */

    function goTo(index) {
        index = Math.max(0, Math.min(slides.length - 1, index));
        if (index === current && deck.dataset.ready === "1") return;
        current = index;
        window.scrollTo(0, 0);
        deck.style.transform = "translateY(-" + current * window.innerHeight + "px)";

        navLinks.forEach(function (link) {
            var target = Number(link.dataset.goto);
            link.classList.toggle("is-active", target === current && link.closest(".nav-links") !== null);
        });

        if (heroVideo) {
            if (current === 0) {
                heroVideo.play().catch(function () {});
            } else {
                heroVideo.pause();
            }
        }

        if (current === 0) {
            revealHero();
        }
        // Slide 3 carries a controls video; pause it when leaving.
        var screenVideo = slides[2] ? slides[2].querySelector("video") : null;
        if (screenVideo && current !== 2) {
            screenVideo.pause();
        }
    }

    function step(delta) {
        if (locked) return;
        var next = current + delta;
        if (next < 0 || next >= slides.length) return;
        locked = true;
        goTo(next);
        setTimeout(function () {
            locked = false;
        }, 950);
    }

    /* ---------------- hero letters ---------------- */

    function buildLetters() {
        var text = heroTitle.textContent.trim();
        var words = text.split(/\s+/);
        heroTitle.textContent = "";
        words.forEach(function (word, w) {
            // Group letters per word so lines only break at spaces,
            // never in the middle of a word.
            var wordBox = document.createElement("span");
            wordBox.className = "word";
            word.split("").forEach(function (ch) {
                var span = document.createElement("span");
                span.className = "ch";
                span.textContent = ch;
                wordBox.appendChild(span);
            });
            heroTitle.appendChild(wordBox);
            if (w < words.length - 1) {
                heroTitle.appendChild(document.createTextNode(" "));
            }
        });
    }

    function revealHero() {
        var letters = heroTitle.querySelectorAll(".ch");
        letters.forEach(function (span, i) {
            span.classList.remove("is-in");
            if (reducedMotion) {
                span.classList.add("is-in");
                return;
            }
            setTimeout(function () {
                span.classList.add("is-in");
            }, 260 + i * 42);
        });
    }

    /* ---------------- hero scenes ---------------- */

    function cycleScenes() {
        if (reducedMotion || heroLayers.length < 2) return;
        sceneIndex = (sceneIndex + 1) % heroLayers.length;
        heroLayers.forEach(function (layer, i) {
            layer.classList.toggle("is-on", i === sceneIndex);
        });
    }

    function startScenes() {
        if (reducedMotion) return;
        sceneTimer = setInterval(cycleScenes, 4600);
    }

    /* ---------------- input ---------------- */

    window.addEventListener("wheel", function (event) {
        if (locked) return;
        var delta = event.deltaY;
        if (Math.abs(delta) < 24) return;
        event.preventDefault();
        step(delta > 0 ? 1 : -1);
    }, { passive: false });

    var touchStartY = null;

    window.addEventListener("touchstart", function (event) {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchend", function (event) {
        if (touchStartY === null) return;
        var delta = touchStartY - event.changedTouches[0].clientY;
        touchStartY = null;
        if (Math.abs(delta) < 48) return;
        step(delta > 0 ? 1 : -1);
    }, { passive: true });

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowDown":
            case "PageDown":
            case " ":
                event.preventDefault();
                step(1);
                break;
            case "ArrowUp":
            case "PageUp":
                event.preventDefault();
                step(-1);
                break;
            case "Home":
                event.preventDefault();
                goTo(0);
                break;
            case "End":
                event.preventDefault();
                goTo(slides.length - 1);
                break;
            default:
                break;
        }
    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            goTo(Number(link.dataset.goto));
        });
    });

    window.addEventListener("resize", function () {
        deck.style.transition = "none";
        deck.style.transform = "translateY(-" + current * window.innerHeight + "px)";
        void deck.offsetHeight;
        deck.style.transition = "";
    });

    // Native anchor jumps or browser restoration must not offset the deck.
    window.addEventListener("scroll", function () {
        if (window.scrollY !== 0) {
            window.scrollTo(0, 0);
        }
    });

    window.addEventListener("load", function () {
        window.scrollTo(0, 0);
    });

    /* ---------------- reader interactions ---------------- */

    var likeBtn = document.getElementById("likeBtn");
    var likeCount = document.getElementById("likeCount");
    var shareBtn = document.getElementById("shareBtn");
    var toast = document.getElementById("shareToast");
    var toastTimer = null;
    var likes = 96;
    var liked = false;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("is-show");
        }, 2200);
    }

    if (likeBtn && likeCount) {
        likeBtn.addEventListener("click", function () {
            liked = !liked;
            likes += liked ? 1 : -1;
            likeCount.textContent = likes;
            likeBtn.classList.toggle("is-liked", liked);
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener("click", function () {
            var payload = { title: document.title, url: location.href };
            if (navigator.share) {
                navigator.share(payload).catch(function () {});
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(location.href).then(function () {
                    showToast("Link copied — share it with a friend");
                }, function () {
                    showToast("Copy the address bar link to share");
                });
            } else {
                showToast("Copy the address bar link to share");
            }
        });
    }

    /* ---------------- boot ---------------- */

    deck.dataset.ready = "1";
    deck.style.transform = "translateY(0)";
    buildLetters();
    revealHero();
    startScenes();
})();
