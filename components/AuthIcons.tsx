type IconProps = {
  className?: string;
};

export function IconEmail({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6.5h16a1.5 1.5 0 0 1 1.06 2.56L13.06 17.2a2 2 0 0 1-2.12 0L2.94 9.06A1.5 1.5 0 0 1 4 6.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        width="14"
        x="5"
        y="11"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="16" fill="currentColor" r="1.2" />
    </svg>
  );
}

export function IconMap({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconSign({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4h9l3 3v13H6V4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M15 4v3h3M8 12h8M8 16h6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconQuiz({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        width="16"
        x="4"
        y="4"
      />
      <path
        d="M8 9h8M8 13h5M8 17h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="17" cy="17" fill="currentColor" r="2" />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12 3 2.2 6.8H21l-5.5 4 2.1 6.7L12 16.4 6.4 20.5l2.1-6.7L3 9.8h6.8L12 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
