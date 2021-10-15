import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { render, configure } from "@testing-library/react";
import useBreakpoints from "../../../../donut/src/hooks/useBreakpoints";
import ApplicationProvider from "components/ApplicationProvider";
import { NotificationsProvider } from "components/Notifications";
import { MockedProvider } from "@apollo/client/testing";
import i18n from "./i18next";
import App from "../App";
import createCache from "../apolloCache";

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  takeRecords() {
    return null;
  }
  unobserve() {
    return null;
  }
};

const TIMEOUT = 20000;
configure({ asyncUtilTimeout: TIMEOUT });

window.focus = jest.fn();

jest.mock("../../../../donut/src/hooks/useBreakpoints", () => jest.fn());

const BREAKPOINTS = ["sUp", "mUp", "lUp", "xlUp"];
beforeEach(() => {
  useBreakpoints.mockReturnValue({
    sUp: false,
    mUp: false,
    lUp: false,
    xlUp: false,
  });
});

export function mockBreakpoint(size) {
  const index = BREAKPOINTS.indexOf(size);
  const activeSizes = BREAKPOINTS.slice(0, index + 1);
  useBreakpoints.mockReturnValue({
    sUp: activeSizes.includes("sUp"),
    mUp: activeSizes.includes("mUp"),
    lUp: activeSizes.includes("lUp"),
    xlUp: activeSizes.includes("xlUp"),
  });
}

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: false,
  value: jest.fn(),
});

Element.prototype.scrollTo = () => {};

if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 1;
}

export const mockElement = () => ({
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
});

export const mockElements = () => {
  const elements = {};
  return {
    create: jest.fn((type) => {
      elements[type] = mockElement();
      return elements[type];
    }),
    getElement: jest.fn((type) => {
      return elements[type] || null;
    }),
  };
};

export const mockStripe = () => ({
  elements: jest.fn(() => mockElements()),
  createToken: jest.fn(),
  createSource: jest.fn(),
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
  confirmCardSetup: jest.fn(),
  paymentRequest: jest.fn(),
  handleCardPayment: () => Promise.resolve({ error: null }),
  handleCardSetup: () => Promise.resolve({ setupIntent: {} }),
});

function Providers({ children, route, graphQLMocks }) {
  const cache = createCache();

  return (
    <I18nextProvider i18n={i18n}>
      <MockedProvider
        mocks={graphQLMocks}
        cache={cache}
        defaultOptions={{
          mutate: {
            errorPolicy: "all",
          },
        }}
      >
        <MemoryRouter initialEntries={[route]}>
          <NotificationsProvider>
            <Elements stripe={mockStripe()}>{children}</Elements>
          </NotificationsProvider>
        </MemoryRouter>
      </MockedProvider>
    </I18nextProvider>
  );
}

export function renderRoute(config) {
  return render(
    <Providers route={config.route} graphQLMocks={config.graphQLMocks}>
      <App />
    </Providers>,
  );
}

export function renderComponent(component, config = {}) {
  return render(
    <Providers
      route={config.route || "/"}
      graphQLMocks={config.graphQLMocks || []}
    >
      <ApplicationProvider>{React.cloneElement(component)}</ApplicationProvider>
    </Providers>,
  );
}

// re-export everything
export * from "@testing-library/react";
export * from "./apolloMocks";
export { default as user } from "@testing-library/user-event";
export { default as mockData } from "./mockData";
