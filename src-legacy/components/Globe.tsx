import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function Globe({ interactive = true }: { interactive?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const rotation = useRef(-0.3);
  const [paused, setPaused] = useState(!interactive);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let points: number[][] = [],
      frame = 0,
      visible = true,
      angle = rotation.current,
      last = 0,
      disposed = false;
    const project = (lon: number, lat: number, r: number, lift = 1) => {
      const a = (lon * Math.PI) / 180 + angle,
        b = (lat * Math.PI) / 180;
      const x = Math.cos(b) * Math.sin(a),
        y = Math.sin(b),
        z = Math.cos(b) * Math.cos(a);
      const tilt = 0.22;
      return [
        300 + r * x * lift,
        300 - r * (y * Math.cos(tilt) - z * Math.sin(tilt)) * lift,
        y * Math.sin(tilt) + z * Math.cos(tilt),
      ];
    };
    const draw = (time: number) => {
      if (disposed) return;
      if (visible && !document.hidden) {
        if (!paused && !media.matches)
          angle += Math.min(time - last, 40) * 0.000075;
        rotation.current = angle;
        const dpr = Math.min(devicePixelRatio, 2);
        if (el.width !== 600 * dpr) {
          el.width = 600 * dpr;
          el.height = 600 * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, 600, 600);
        const glow = ctx.createRadialGradient(300, 300, 210, 300, 300, 297);
        glow.addColorStop(0, "#5ed8b420");
        glow.addColorStop(1, "#5ed8b400");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 600, 600);
        const ocean = ctx.createRadialGradient(205, 170, 20, 310, 310, 252);
        ocean.addColorStop(0, "#245047");
        ocean.addColorStop(0.6, "#102e29");
        ocean.addColorStop(1, "#071b19");
        ctx.fillStyle = ocean;
        ctx.beginPath();
        ctx.arc(300, 300, 247, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#9de8ca12";
        ctx.lineWidth = 0.7;
        for (let lat = -60; lat <= 60; lat += 30) {
          ctx.beginPath();
          let started = false;
          for (let lon = -180; lon <= 180; lon += 3) {
            const [x, y, z] = project(lon, lat, 248);
            if (z > 0) {
              if (!started) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              started = true;
            } else started = false;
          }
          ctx.stroke();
        }
        for (const [lon, lat] of points) {
          const [x, y, z] = project(lon, lat, 248);
          if (z < 0) continue;
          ctx.fillStyle = `rgba(151,225,201,${0.2 + z * 0.65})`;
          ctx.beginPath();
          ctx.arc(x, y, 0.65 + z * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
        const cities = [
          [4.9, 52.37],
          [-74, 40.7],
          [-46.6, -23.5],
          [55.3, 25.2],
          [103.8, 1.3],
          [139.7, 35.7],
          [151.2, -33.8],
        ];
        for (let k = 1; k < cities.length; k++) {
          const route: number[][] = [];
          for (let i = 0; i <= 80; i++) {
            const t = i / 80;
            route.push(
              project(
                cities[0][0] + (cities[k][0] - cities[0][0]) * t,
                cities[0][1] + (cities[k][1] - cities[0][1]) * t,
                249,
                1 + 0.15 * Math.sin(t * Math.PI),
              ),
            );
          }
          ctx.beginPath();
          let start = false;
          for (const [x, y, z] of route) {
            if (z > 0) {
              if (!start) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              start = true;
            } else start = false;
          }
          ctx.strokeStyle = "#a8f3d76b";
          ctx.lineWidth = 1;
          ctx.stroke();
          const [x, y, z] =
            route[Math.floor(((((angle * 1.8 + k * 0.17) % 1) + 1) % 1) * 80)];
          if (z > 0) {
            ctx.shadowColor = "#afffe1";
            ctx.shadowBlur = 12;
            ctx.fillStyle = "#e1fff1";
            ctx.beginPath();
            ctx.arc(x, y, 2.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
        ctx.beginPath();
        ctx.arc(300, 300, 248, 0, Math.PI * 2);
        ctx.strokeStyle = "#9de8ca55";
        ctx.stroke();
      }
      last = time;
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    observer.observe(el);
    fetch("/assets/globe-points.json")
      .then((r) => r.json())
      .then((p) => {
        points = p;
      })
      .catch(() => {});
    frame = requestAnimationFrame(draw);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused]);
  return (
    <div className="living-globe">
      <canvas
        ref={canvas}
        role="img"
        aria-label="Globe with illuminated international shipping routes"
      />
      {interactive && (
        <button
          className="globe-control"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play globe animation" : "Pause globe animation"}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      )}
    </div>
  );
}
