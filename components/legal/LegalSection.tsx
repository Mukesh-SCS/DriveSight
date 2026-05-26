import type { ReactNode } from "react";

type LegalSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  variant?: "default" | "highlight";
};

export function LegalSection({
  id,
  title,
  children,
  variant = "default",
}: LegalSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className={`legal-section ${variant === "highlight" ? "legal-section-highlight" : ""}`}
    >
      <h2 className="legal-section-title" id={id}>
        {title}
      </h2>
      <div className="legal-section-body">{children}</div>
    </section>
  );
}
