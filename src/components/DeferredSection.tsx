import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DeferredSectionProps = {
  children: ReactNode;
  id?: string;
  minHeight?: string;
  rootMargin?: string;
};

const DeferredSection = ({
  children,
  id,
  minHeight = "24rem",
  rootMargin = "900px 0px",
}: DeferredSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={sectionRef}
      id={id}
      style={{ minHeight: isVisible ? undefined : minHeight }}
      aria-busy={!isVisible}
    >
      {isVisible ? (
        <Suspense
          fallback={
            <div
              style={{ minHeight }}
              aria-hidden="true"
            />
          }
        >
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

export default DeferredSection;
