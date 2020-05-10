import "./elemSingleton.css";

type ElemPosition = {
  top: number;
  left: number;
};

export interface ElemSingleton<T extends HTMLElement> {
  element: T;
  show: (position?: ElemPosition) => unknown;
  hide: () => void;
}

export const show = <T extends HTMLElement>(element: T) => (
  { top, left }: ElemPosition = { top: 0, left: 0 }
) => {
  element.style.transform = `translate(${left}px, ${top}px)`;
};

export const hide = <T extends HTMLElement>(element: T) => () => {
  element.style.transform = "translate(-100%, -100%)";
};
