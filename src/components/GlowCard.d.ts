import { ReactNode } from "react";

interface GlowCardProps {
  card: {
    review?: string;
    title?: string;
  };
  children: ReactNode;
  index?: number;
}

declare const GlowCard: (props: GlowCardProps) => JSX.Element;
export default GlowCard;
