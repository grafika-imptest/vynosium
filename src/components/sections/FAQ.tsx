"use client";

import { useRef, useState } from "react";
import { gsap, ensureGsapRegistered, prefersReducedMotion } from "@/lib/motion";
import { SectionIndex } from "@/components/ui/SectionIndex";
import { FAQ_ITEMS } from "@/lib/data/faq";

export function FAQ() {
  return (
    <section className="bg-white py-[var(--space-10)]" data-scene="faq">
      <div className="mx-auto max-w-[var(--max-w-text)] px-[var(--gutter)]">
        <SectionIndex index="12" label="ČASTÉ OTÁZKY" tone="light" className="mb-8" />
        <h2 className="text-heading mb-8 text-navy">Otázky, které si investoři kladou nejčastěji</h2>
        <div className="border-t border-light-gray">
          {FAQ_ITEMS.map((item, i) => (
            <FaqRow key={item.q} question={item.q} answer={item.a} defaultOpen={Boolean(item.defaultOpen)} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRow({
  question,
  answer,
  defaultOpen,
  index,
}: {
  question: string;
  answer: string;
  defaultOpen: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    ensureGsapRegistered();
    const next = !open;
    setOpen(next);
    const body = bodyRef.current;
    const inner = innerRef.current;
    if (!body || !inner) return;

    if (prefersReducedMotion()) {
      gsap.set(body, { height: next ? "auto" : 0 });
      return;
    }

    if (next) {
      gsap.fromTo(
        body,
        { height: 0 },
        { height: inner.offsetHeight, duration: 0.45, ease: "power3.inOut", onComplete: () => gsap.set(body, { height: "auto" }) }
      );
    } else {
      gsap.fromTo(body, { height: inner.offsetHeight }, { height: 0, duration: 0.45, ease: "power3.inOut" });
    }
  };

  return (
    <div
      className="border-b transition-colors duration-300"
      style={{ borderColor: open ? "var(--color-emerald)" : "var(--color-light-gray)" }}
    >
      <button
        type="button"
        onClick={toggle}
        className="focus-ring flex w-full items-center justify-between gap-6 py-5 text-left"
        aria-expanded={open}
        id={`faq-trigger-${index}`}
      >
        <span className="text-body text-navy">{question}</span>
        <span
          className="text-label shrink-0"
          style={{ color: open ? "var(--color-emerald)" : "var(--color-text-muted)" }}
          aria-hidden="true"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      <div ref={bodyRef} style={{ height: defaultOpen ? "auto" : 0, overflow: "hidden" }}>
        <div ref={innerRef} className="pb-5">
          <p className="text-body-sm max-w-[68ch] text-text-secondary">{answer}</p>
        </div>
      </div>
    </div>
  );
}
