import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Option = { value: string; label: string; title?: string };

type Props = {
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
};

/**
 * Segmented control with a thumb that travels between options.
 *
 * The thumb is measured from the real buttons rather than assuming equal
 * widths, so labels of different lengths still line up exactly. Measurement
 * runs again on resize because the type scale is fluid.
 */
export function Segmented({
  name,
  value,
  options,
  onChange,
  className = "",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ x: 0, w: 0, ready: false });

  useLayoutEffect(() => {
    const measure = () => {
      const node = wrap.current;
      if (!node) return;
      const active = node.querySelector<HTMLButtonElement>(
        '[aria-pressed="true"]',
      );
      if (!active) return;
      setThumb({
        x: active.offsetLeft - 3,
        w: active.offsetWidth,
        ready: true,
      });
    };
    measure();

    const observer = new ResizeObserver(measure);
    if (wrap.current) observer.observe(wrap.current);
    return () => observer.disconnect();
  }, [value, options]);

  /**
   * Left and right arrows step through the options.
   *
   * They move from whichever option currently has focus, not from whichever
   * one is selected. Every button here is in the tab order, so those two can
   * differ, and moving from the selection would make the control jump away
   * from where the person is actually looking.
   */
  useEffect(() => {
    const node = wrap.current;
    if (!node) return;

    const onKey = (event: KeyboardEvent) => {
      const dir =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;

      const buttons = [...node.querySelectorAll<HTMLButtonElement>("button")];
      const from = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (from === -1) return;

      event.preventDefault();
      const at = (from + dir + buttons.length) % buttons.length;
      onChange(options[at].value);
      buttons[at].focus();
    };

    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [options, onChange]);

  return (
    <div className="seg-rail">
      <div
        className={`seg ${className}`}
        ref={wrap}
        role="group"
        aria-label={name}
      >
        <span
          className="seg-thumb"
          aria-hidden="true"
          style={{
            transform: `translateX(${thumb.x}px)`,
            width: `${thumb.w}px`,
            opacity: thumb.ready ? 1 : 0,
          }}
        />
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="seg-btn"
            aria-pressed={option.value === value}
            title={option.title}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
