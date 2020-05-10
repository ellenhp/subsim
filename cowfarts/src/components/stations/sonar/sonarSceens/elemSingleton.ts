import "./elemSingleton.css";

type ElemPosition = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export interface ElemSingleton<T extends HTMLElement> {
  element: T;
  show: (position?: ElemPosition) => unknown;
  hide: () => void;
}

export const show = <T extends HTMLElement>(element: T) => (
  { top, left, bottom, right }: ElemPosition = {
    top: 0,
    bottom: 100,
    left: 0,
    right: 100,
  }
) => {
  element.style.transform = `translate(${left}px, ${top}px)`;
  element.style.height = `${bottom - top}px`;
  element.style.width = `${right - left}px`;
};

export const hide = <T extends HTMLElement>(element: T) => () => {
  element.style.transform = "translate(-100%, -100%)";
};
