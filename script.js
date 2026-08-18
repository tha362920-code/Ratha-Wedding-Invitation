/**
 * Global Asset Preloader Cache Engine Module Routine
 */
const AssetPreloader = (function() {
    function runBootSequence() {
        let currentProgress = 0;
        const progressNode = document.getElementById('load-progress-node');
        
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
                terminatePreloaderWindow();
            }
            progressNode.style.width = currentProgress + '%';
        }, 80);
    }

    function terminatePreloaderWindow() {
        const preloader = document.getElementById('module-preloader');
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => preloader.remove(), 600);
    }

    return { init: runBootSequence };
})();

// Wait for the DOM to be fully loaded, then run the preloader
document.addEventListener("DOMContentLoaded", () => {
    AssetPreloader.init();
});

/**
 * 60FPS High-Performance Canvas Decoration Engine
 */
const VectorParticleSystem = (function() {
    let canvas, ctx;
    let initialized = false;
    let elementsArray = [];
    const elementCap = 25; 

    function initSystem() {
        canvas = document.getElementById('particle-canvas');
        ctx = canvas.getContext('2d');
        resizeViewport();
        window.addEventListener('resize', resizeViewport);

        for (let i = 0; i < elementCap; i++) {
            elementsArray.push(spawnRandomParticle(true));
        }
        initialized = true;
        executeEngineFrameLoop();
    }

    function resizeViewport() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function spawnRandomParticle(randomY = false) {
        return {
            x: Math.random() * canvas.width,
            y: randomY ? Math.random() * canvas.height : -20,
            size: Math.random() * 8 + 4,
            speedX: Math.random() * 1.5 - 0.5,
            speedY: Math.random() * 1.2 + 0.6,
            rotation: Math.random() * 360,
            rotationVelocity: Math.random() * 2 - 1,
            type: Math.random() > 0.45 ? 'petal' : 'goldDust',
            opacity: Math.random() * 0.5 + 0.3
        };
    }

    function executeEngineFrameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < elementsArray.length; i++) {
            let p = elementsArray[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationVelocity;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;

            if (p.type === 'petal') {
                ctx.fillStyle = 'rgba(242, 194, 203, 0.7)';
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                ctx.fillStyle = '#d4af37';
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#f3e5ab';
                ctx.fillRect(-p.size/4, -p.size/4, p.size/2, p.size/2);
            }
            ctx.restore();

            if (p.y > canvas.height + 20 || p.x > canvas.width + 20 || p.x < -20) {
                elementsArray[i] = spawnRandomParticle(false);
            }
        }
        requestAnimationFrame(executeEngineFrameLoop);
    }

    return { start: initSystem };
})();

/**
 * Navigation Application Router State Machine
 */
const AppStateMachine = (function() {
    function updateViewState(targetStageId) {
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('view-active');
        });
        document.getElementById(targetStageId).classList.add('view-active');
    }

    function processCoverStateTransition() {
        const doorFrame = document.getElementById('view-doors');
        doorFrame.classList.add('doors-displaced');
        
        setTimeout(() => {
            updateViewState('view-cover');
        }, 1400);
    }

    function dispatchVideoSystemInterception() {
        updateViewState('view-video-interstitial');
        const videoNode = document.getElementById('interstitial-player');
        
        videoNode.muted = false;
        videoNode.currentTime = 0;
        
        let playPromise = videoNode.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                videoNode.muted = true;
                videoNode.play();
            });
        }

        GlobalAudioController.forceAudioStart();

        setTimeout(() => {
            executeMainApplicationUnlock();
        }, 5200);
    }

    function executeMainApplicationUnlock() {
        const videoView = document.getElementById('view-video-interstitial');
        videoView.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('interstitial-player').pause();
            updateViewState('view-main-app');
            document.getElementById('audio-dashboard-trigger').classList.add('hub-visible');
            ScrollAnimationObserver.run();
        }, 600);
    }

    return {
        transitionToCover: processCoverStateTransition,
        launchVideoSequence: dispatchVideoSystemInterception
    };
})();

/**
 * Precise Real-Time Global Audio Controller Interface
 */
const GlobalAudioController = (function() {
    let trackInstance;
    let iconInstance;

    function initAudioPointers() {
        trackInstance = document.getElementById('core-audio-track');
        iconInstance = document.getElementById('audio-icon-indicator');
    }

    function checkAudioTrackActivation() {
        trackInstance.play().then(() => {
            iconInstance.innerText = '🔊 ON';
        }).catch(() => {
            console.log("Tactile threshold interaction mandatory required loop asset override.");
        });
    }

    function switchPlaybackState() {
        if (trackInstance.paused) {
            trackInstance.play();
            iconInstance.innerText = '🔊 ON';
        } else {
            trackInstance.pause();
            iconInstance.innerText = '🔇 MUTE';
        }
    }

    return {
        setup: initAudioPointers,
        forceAudioStart: checkAudioTrackActivation,
        toggleState: switchPlaybackState
    };
})();

/**
 * Intersection Scroll Engine Observation Layer
 */
const ScrollAnimationObserver = (function() {
    function runObserverContext() {
        const targets = document.querySelectorAll('.scroll-card');
        const schemaConfiguration = {
            threshold: 0.08,
            rootMargin: "0px 0px -25px 0px"
        };

        const scrollProcessor = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, schemaConfiguration);

        targets.forEach(t => scrollProcessor.observe(t));
    }

    return { run: runObserverContext };
})();

/**
 * Chronometer Countdown Automation Pipeline Engine
 */
const CountdownCalculator = (function() {
    const deadlineTime = new Date('August 21, 2026 06:30:00').getTime();

    function syncTickMetrics() {
        const now = new Date().getTime();
        const remainder = deadlineTime - now;

        if (remainder <= 0) {
            document.querySelectorAll('.matrix-digit').forEach(n => n.innerText = '00');
            return;
        }

        const d = Math.floor(remainder / (1000 * 60 * 60 * 24));
        const h = Math.floor((remainder % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((remainder % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remainder % (1000 * 60)) / 1000);

        document.getElementById('node-days').innerText = d < 10 ? '0' + d : d;
        document.getElementById('node-hours').innerText = h < 10 ? '0' + h : h;
        document.getElementById('node-min').innerText = m < 10 ? '0' + m : m;
        document.getElementById('node-sec').innerText = s < 10 ? '0' + s : s;
    }

    function beginChronometerLoop() {
        syncTickMetrics();
        setInterval(syncTickMetrics, 1000);
    }

    return { init: beginChronometerLoop };
})();

/**
 * Dynamic URL Parameter Name Decoder Assignment Module
 */
const TargetParamParser = (function() {
    function assignDynamicName() {
        const lookup = new URLSearchParams(window.location.search);
        const queryTarget = lookup.get('to');
        if (queryTarget) {
            document.getElementById('ui-guest-target').innerText = decodeURIComponent(queryTarget);
        }
    }
    return { execute: assignDynamicName };
})();

/**
 * Gallery Image Lightbox Viewing Tool Core Logic Frame
 */
const LightboxController = (function() {
    let overlay, elementImg;

    function cacheElements() {
        overlay = document.getElementById('lightbox-overlay');
        elementImg = document.getElementById('lightbox-target-img');
    }

    function triggerOpen(sourceUrl) {
        elementImg.src = sourceUrl;
        overlay.style.display = 'flex';
        setTimeout(() => overlay.style.opacity = '1', 20);
    }

    function triggerClose() {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 400);
    }

    return {
        setup: cacheElements,
        openView: triggerOpen,
        closeView: triggerClose
    };
})();

/**
 * RSVP Form Pipeline Processing Modules Hooks
 */
const RSVPFormHandler = (function() {
    function handleFormSubmission(event) {
        event.preventDefault();
        const userName = document.getElementById('rsvp-input-name').value;
        const countVal = document.getElementById('rsvp-input-count').value;
        
        alert(`សូមអរគុណសម្រាប់បញ្ជាក់ការចូលរួម!\nThank you ${userName}! Registration for ${countVal} guest(s) recorded successfully.`);
        document.getElementById('rsvp-processing-form').reset();
    }
    return { processSubmission: handleFormSubmission };
})();

/**
 * Local State Component Module Streaming Engine Wishbook
 */
const WishbookHandler = (function() {
    function handlePost(e) {
        e.preventDefault();
        const nameNode = document.getElementById('wish-input-name');
        const msgNode = document.getElementById('wish-input-msg');
        const targetWindow = document.getElementById('wishbook-scroll-box');

        const wrapper = document.createElement('div');
        wrapper.className = 'comment-node';
        wrapper.innerHTML = `<div class="comment-author">${nameNode.value}</div><div class="comment-body">${msgNode.value}</div>`;
        
        targetWindow.insertBefore(wrapper, targetWindow.firstChild);
        targetWindow.scrollTop = 0;

        nameNode.value = '';
        msgNode.value = '';
    }
    return { postMessage: handlePost };
})();

// ==========================================================================
// APPLICATION MASTER ENGINE EXECUTION ORCHESTRATION BRIDGE INITIALIZER
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    AssetPreloader.init();
    VectorParticleSystem.start();
    GlobalAudioController.setup();
    CountdownCalculator.init();
    TargetParamParser.execute();
    LightboxController.setup();
});