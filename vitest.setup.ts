/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";

let randomMock: any;

beforeAll(() => {
  randomMock = vi.spyOn(Math, "random").mockReturnValue(0.5);
});

afterAll(() => {
  randomMock.mockRestore();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
