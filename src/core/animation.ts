/**
 * Compiles the core CSS keyframe animations for the procedural 120-second Spiti Valley time-cycle.
 * Dynamically shifts sky, sun, haze, river, and monastery shadows.
 * 
 * @returns CSS styles markup string.
 */
export function compileCSSAnimations(): string {
  return `
  :root {
    --sky-top: #79BFFF;
    --sky-bot: #CBE8FF;
    --sun-color: #5CAEFF;
    --haze-color: rgba(203, 213, 225, 0.4);
    --river-color: #79dfff;
    --monastery-shadow: rgba(15, 23, 42, 0.08);
    animation: atmosphericCycle 120s linear infinite;
  }
  
  @keyframes atmosphericCycle {
    0%, 100% {
      --sky-top: #79BFFF;
      --sky-bot: #CBE8FF;
      --sun-color: #5CAEFF;
      --haze-color: rgba(203, 213, 225, 0.4);
      --river-color: #79dfff;
      --monastery-shadow: rgba(15, 23, 42, 0.08);
    }
    16% { /* Golden Hour */
      --sky-top: #FFDD94;
      --sky-bot: #FFECC2;
      --sun-color: #FFD36B;
      --haze-color: rgba(253, 186, 116, 0.5);
      --river-color: #fbcfe8;
      --monastery-shadow: rgba(67, 20, 7, 0.1);
    }
    33% { /* Sunset */
      --sky-top: #F48C6A;
      --sky-bot: #FFB085;
      --sun-color: #E65C68;
      --haze-color: rgba(244, 63, 94, 0.6);
      --river-color: #f472b6;
      --monastery-shadow: rgba(136, 19, 55, 0.15);
    }
    50% { /* Blue Hour */
      --sky-top: #3D5A99;
      --sky-bot: #6A82C8;
      --sun-color: #5673B8;
      --haze-color: rgba(99, 102, 241, 0.3);
      --river-color: #38bdf8;
      --monastery-shadow: rgba(49, 46, 129, 0.2);
    }
    66% { /* Night */
      --sky-top: #071425;
      --sky-bot: #1A3560;
      --sun-color: #102443;
      --haze-color: rgba(15, 23, 42, 0.85);
      --river-color: #1d4ed8;
      --monastery-shadow: rgba(2, 6, 23, 0.4);
    }
    83% { /* Dawn */
      --sky-top: #f472b6;
      --sky-bot: #fef08a;
      --sun-color: #fbbf24;
      --haze-color: rgba(254, 215, 170, 0.3);
      --river-color: #e0f2fe;
      --monastery-shadow: rgba(67, 20, 7, 0.1);
    }
  }

  /* Scenic animations classes */
  .sun-glow {
    animation: sunPulse 6s ease-in-out infinite alternate;
  }
  @keyframes sunPulse {
    from { transform: scale(0.96); opacity: 0.85; }
    to { transform: scale(1.04); opacity: 1.00; }
  }

  .cloud-slow {
    animation: cloudDrift 120s linear infinite;
  }
  @keyframes cloudDrift {
    from { transform: translateX(-400px); }
    to { transform: translateX(1000px); }
  }

  .river-shimmer {
    stroke-dasharray: 8 18;
    animation: riverShimmerAnim 4s linear infinite;
  }
  @keyframes riverShimmerAnim {
    from { stroke-dashoffset: 0; }
    to { stroke-dashoffset: -100; }
  }

  .flag-flutter {
    animation: flagFlutterAnim 2.5s ease-in-out infinite alternate;
    transform-origin: center;
  }
  @keyframes flagFlutterAnim {
    from { transform: rotate(-0.5deg) scaleY(0.97); }
    to { transform: rotate(0.5deg) scaleY(1.03); }
  }

  .yak-graze {
    animation: yakGrazeAnim 8s ease-in-out infinite alternate;
    transform-origin: bottom center;
  }
  @keyframes yakGrazeAnim {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-3deg) translateY(1px); }
  }

  .bird-glide {
    animation: birdGlideAnim 20s linear infinite;
  }
  @keyframes birdGlideAnim {
    0% { transform: translate(-100px, 80px) scale(0.8); }
    50% { transform: translate(450px, 120px) scale(0.9); }
    100% { transform: translate(1060px, 70px) scale(0.8); }
  }

  .star-blink {
    animation: starBlinkAnim 3s ease-in-out infinite alternate;
  }
  @keyframes starBlinkAnim {
    from { opacity: 0.25; }
    to { opacity: 1; }
  }

  .shooting-star {
    animation: shootingStarAnim 30s linear infinite;
  }
  @keyframes shootingStarAnim {
    0% { transform: translate(800px, -50px) scale(0); opacity: 0; }
    2% { transform: translate(400px, 200px) scale(1); opacity: 1; }
    4% { transform: translate(100px, 350px) scale(0); opacity: 0; }
    100% { transform: translate(100px, 350px) scale(0); opacity: 0; }
  }

  /* Weather Falling Particles */
  .snow {
    animation: snowFallAnim 7s linear infinite;
  }
  @keyframes snowFallAnim {
    0% { transform: translateY(0) translateX(0); }
    100% { transform: translateY(1460px) translateX(25px); }
  }

  .raindrop {
    animation: rainFallAnim 1.4s linear infinite;
  }
  @keyframes rainFallAnim {
    0% { transform: translateY(0); }
    100% { transform: translateY(1460px); }
  }

  .dust {
    animation: dustBlowAnim 4.5s linear infinite;
  }
  @keyframes dustBlowAnim {
    0% { transform: translate(0, 0); opacity: 0.15; }
    50% { opacity: 0.5; }
    100% { transform: translate(960px, 140px); opacity: 0.05; }
  }
  `;
}
