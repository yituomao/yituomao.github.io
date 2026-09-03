/* ============================================
   GLOSS 2.0 — From Glossy to Digital
   ============================================ */
(function () {
    'use strict';

    /* ---------- 1. 移动端导航 ---------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.getElementById('navMobile');

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMobile.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // 点击链接后关闭移动菜单
        navMobile.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navMobile.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- 2. 滚动时导航缩小/变影 ---------- */
    const navWrap = document.querySelector('.nav-wrap');
    const NAV_SHRINK_AT = 60;

    function handleNavScroll() {
        if (!navWrap) return;
        if (window.scrollY > NAV_SHRINK_AT) {
            navWrap.style.top = '12px';
        } else {
            navWrap.style.top = '20px';
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ---------- 3. Design Playground 轮播 ---------- */
    const track = document.getElementById('playgroundTrack');
    const slides = track ? track.querySelectorAll('.playground-slide') : [];
    const prevBtn = document.querySelector('.pg-prev');
    const nextBtn = document.querySelector('.pg-next');
    const dotsWrap = document.getElementById('pgDots');
    let currentSlide = 0;
    let autoplayTimer = null;

    if (track && slides.length) {
        // 创建圆点
        slides.forEach(function (_, i) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function () {
                goToSlide(i);
                resetAutoplay();
            });
            if (dotsWrap) dotsWrap.appendChild(dot);
        });

        const dots = dotsWrap ? dotsWrap.querySelectorAll('span') : [];

        function goToSlide(index) {
            currentSlide = (index + slides.length) % slides.length;
            track.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); resetAutoplay(); });
        if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); resetAutoplay(); });

        // 自动播放
        function startAutoplay() {
            autoplayTimer = setInterval(nextSlide, 4500);
        }
        function stopAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
        }
        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // 鼠标悬停暂停
        const stage = document.querySelector('.playground-stage');
        if (stage) {
            stage.addEventListener('mouseenter', stopAutoplay);
            stage.addEventListener('mouseleave', startAutoplay);
        }

        // 触摸滑动
        let touchStartX = 0;
        let touchEndX = 0;
        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });
        track.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide(); else prevSlide();
            }
            startAutoplay();
        }, { passive: true });

        // 键盘控制
        document.addEventListener('keydown', function (e) {
            if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
            if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
            if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
        });

        startAutoplay();
    }

    /* ---------- 4. Confidential Files 彩蛋开关 ---------- */
    const toggle = document.getElementById('confidentialToggle');
    const reveal = document.getElementById('confidentialReveal');
    const card = document.getElementById('confidentialCard');

    if (toggle && reveal) {
        toggle.addEventListener('click', function () {
            const isOpen = toggle.getAttribute('aria-pressed') === 'true';
            const nextState = !isOpen;
            toggle.setAttribute('aria-pressed', String(nextState));
            reveal.classList.toggle('open', nextState);

            // 打开时卡片轻微抖动
            if (nextState && card) {
                card.style.animation = 'none';
                // 强制重排后加动画
                void card.offsetWidth;
                card.style.animation = 'shake 0.4s ease';
                setTimeout(function () { card.style.animation = ''; }, 400);
            }
        });
    }

    /* ---------- 5. 滚动入场动画 ---------- */
    const revealElements = document.querySelectorAll(
        '.section-title, .work-card, .whatido-col, .exp-item, .exp-toolkit, .confidential-card, .footer-links, .footer-name, .letter-card, .film-frame, .archive-item, .look-item, .toc-list, .beauty-copy, .beauty-visuals, .masthead-grid article, .next-card, .spread-copy'
    );

    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(function (el) { observer.observe(el); });
    } else {
        // 降级处理
        revealElements.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- 6. 作品卡片 3D 倾斜效果 ---------- */
    const cards = document.querySelectorAll('.work-card');
    cards.forEach(function (card) {
        const inner = card.querySelector('.work-card-inner');
        if (!inner) return;

        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const tiltX = -y * 6;
            const tiltY = x * 6;
            inner.style.transform = 'translateY(-6px) perspective(1200px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            inner.style.transform = '';
        });
    });

    /* ---------- 7. 导航高亮当前区块 ---------- */
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        const href = link.getAttribute('href');
                        link.classList.toggle('active', href === '#' + id);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(function (s) { navObserver.observe(s); });
    }

    /* ---------- 8. 平滑滚动偏移（修正固定导航遮挡） ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const href = a.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- 9. 注入 shake 动画 ---------- */
    const styleEl = document.createElement('style');
    styleEl.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}';
    document.head.appendChild(styleEl);

    /* ---------- 10. 导航 active 样式 ---------- */
    const navActiveStyle = document.createElement('style');
    navActiveStyle.textContent = '.nav-links a.active{background:var(--ink);color:var(--bg)}';
    document.head.appendChild(navActiveStyle);

    /* ---------- 11. 订阅表单轻提示 ---------- */
    const subscribeForm = document.querySelector('.subscribe');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = subscribeForm.querySelector('input');
            const button = subscribeForm.querySelector('button');
            if (!input || !input.value) return;
            button.textContent = 'Saved for Issue 09';
            input.value = '';
            input.placeholder = 'you are on the list';
            setTimeout(function () {
                button.textContent = 'Request Issue 09';
            }, 2400);
        });
    }

    /* ---------- 12. 页面加载完成提示 ---------- */
    console.log('%c GLOSS 2.0 · From Glossy to Digital ', 'background:#1c1814;color:#f3ece1;padding:6px 12px;border-radius:4px;font-weight:600;');
    console.log('%c Scrolled, clicked, played ✦ ', 'color:#c4572a;font-style:italic;');
})();
