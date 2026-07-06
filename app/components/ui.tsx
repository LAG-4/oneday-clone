"use client";

const brodyAsset = (name: string) => `/brody/assets/${name}`;

const buttonScribble =
  "M11.4537 22.3596C19.6545 18.1847 27.8552 14.0098 32.8344 11.6445C41.5581 7.50052 10.5956 39.1206 6.13386 45.1438C2.89568 49.5152 3.9942 49.3863 5.19398 49.025C6.39374 48.6638 7.66149 48.0741 16.6566 42.4134C25.6517 36.7528 42.3355 26.0392 51.4912 20.0762C60.6469 14.1132 61.7484 12.4942 62.1378 12.8874C62.5272 13.2807 62.0891 12.7872 55.478 21.125C48.8669 29.4627 36.0752 45.8928 29.3568 54.687C22.6384 63.4811 22.3809 64.1413 22.567 64.3494C22.8772 64.6964 42.6498 51.3989 42.9267 51.203C56.191 41.8144 67.6277 33.8285 81.2663 24.2328C94.9049 14.6371 97.8293 12.9711 99.9697 11.818C100.642 11.4558 105.373 8.65201 104.36 10.5163C103.993 11.1922 103.237 12.3518 94.5861 22.3596C85.935 32.3674 62.1378 61.3918 62.1378 61.3918C62.1378 61.3918 53.0608 71.5223 53.3949 72.0021C53.729 72.482 56.2351 70.9697 67.1706 62.6156C78.1062 54.2615 118.271 23.2751 121.489 24.184C124.707 25.093 95.9878 68.8273 94.5862 74.2402C93.1846 79.6531 124.396 46.4414 134.63 39.8584";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "base" | "dark" | "outline";
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function ActionButton({
  children,
  href,
  className = "",
  variant = "base",
  external = false,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  const classes = `action-button action-button--${variant} ${className}`;
  const content = (
    <>
      <span className="action-button__bg" />
      <span className="action-button__inner">
        <span className="action-button__hover" aria-hidden="true">
          {children}
        </span>
        <span className="action-button__text">{children}</span>
        <svg
          aria-hidden="true"
          className="action-button__scribble"
          viewBox="0 0 139 85"
          preserveAspectRatio="none"
        >
          <path d={buttonScribble} />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

export function TextLink({
  label,
  href,
  external,
  onClick,
}: {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      className="text-draw"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className="text-draw__line" aria-hidden="true" />
    </a>
  );
}

export function BrodyLogo({ className = "" }: { className?: string }) {
  return (
    <img
      alt="Brody Billings"
      className={`brody-logo ${className}`}
      src={brodyAsset("logo.png")}
    />
  );
}

export function BrodyMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brody-mark ${className}`} aria-hidden="true">
      <img alt="" src={brodyAsset("logo.png")} />
    </span>
  );
}

export { brodyAsset };
