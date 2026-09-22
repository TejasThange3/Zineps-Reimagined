import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowUpRight } from "lucide-react";

export function Logo() {
  return (
    <span className="logo-plaque">
      <img src="/assets/brand/logo.svg" width="121" height="30" alt="Zineps" />
    </span>
  );
}
export function ExternalLink({
  href,
  children,
  className = "button",
  showIcon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {showIcon && <ArrowUpRight size={17} aria-hidden="true" />}
      <span className="sr-only"> (official site, opens in a new tab)</span>
    </a>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={onClose}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const focusable = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]',
          ),
        );
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={`Close ${title.toLowerCase()}`}
            autoFocus
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
