import { useEffect, useState } from "react";

type Mode = "light" | "dark";

function resolve(): Mode {
  const stored = localStorage.getItem("zineps-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => setMode(resolve()), []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", mode === "dark" ? "#0b0f0e" : "#f6f7f6");
  }, [mode]);

  /* Follow the system until the visitor states a preference of their own. */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem("zineps-theme"))
        setMode(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    localStorage.setItem("zineps-theme", next);
    setMode(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} appearance`}
      title={`Switch to ${mode === "dark" ? "light" : "dark"} appearance`}
    >
      <span className="theme-toggle-face" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="15" height="15">
          {/* A single circle with a travelling mask reads as sun or moon
              depending on where the mask sits, so one shape covers both. */}
          <mask id="theme-mask">
            <rect width="16" height="16" fill="#fff" />
            <circle
              cx={mode === "dark" ? 11 : 17}
              cy={mode === "dark" ? 5 : -1}
              r="5.2"
              fill="#000"
            />
          </mask>
          <circle
            cx="8"
            cy="8"
            r={mode === "dark" ? 5.2 : 3.5}
            fill="currentColor"
            mask="url(#theme-mask)"
          />
          <g
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity={mode === "dark" ? 0 : 1}
            className="theme-rays"
          >
            <path d="M8 .9v1.7M8 13.4v1.7M.9 8h1.7M13.4 8h1.7M3 3l1.2 1.2M11.8 11.8 13 13M13 3l-1.2 1.2M4.2 11.8 3 13" />
          </g>
        </svg>
      </span>
    </button>
  );
}
