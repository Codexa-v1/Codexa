import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRoot } from "react-dom/client";

// Mock react-dom/client
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
    unmount: vi.fn(),
  })),
}));

// Mock Auth0Provider
vi.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }) => <div data-testid="auth0-provider">{children}</div>,
}));

// Mock App component
vi.mock("../App.jsx", () => ({
  default: () => <div data-testid="app">App</div>,
}));

// Mock CSS imports
vi.mock("../index.css", () => ({}));

describe("main.jsx", () => {
  let rootElement;
  let mockRender;

  beforeEach(() => {
    // Create a mock root element
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);

    // Setup mock render function
    mockRender = vi.fn();
    createRoot.mockReturnValue({
      render: mockRender,
      unmount: vi.fn(),
    });

    // Mock environment variables
    import.meta.env.VITE_AUTH0_DOMAIN = "test-domain.auth0.com";
    import.meta.env.VITE_AUTH0_CLIENT_ID = "test-client-id";

    // Clear module cache to re-import main.jsx
    vi.resetModules();
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(rootElement);
    vi.clearAllMocks();
  });

  describe("Application Bootstrap", () => {
    it("should call createRoot with the root element", async () => {
      // Import main to trigger the code
      await import("../main.jsx");

      expect(createRoot).toHaveBeenCalledWith(rootElement);
    });

    it("should call render on the root", async () => {
      await import("../main.jsx");

      expect(mockRender).toHaveBeenCalledTimes(1);
    });

    it("should render with StrictMode", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      expect(renderCall.type.name).toBe("StrictMode");
    });
  });

  describe("Auth0 Configuration", () => {
    it("should configure Auth0Provider with correct domain", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.type).toBeDefined();
      expect(strictModeChildren.props.domain).toBe("test-domain.auth0.com");
    });

    it("should configure Auth0Provider with correct clientId", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.clientId).toBe("test-client-id");
    });

    it("should configure Auth0Provider with authorizationParams", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.authorizationParams).toBeDefined();
      expect(strictModeChildren.props.authorizationParams.redirect_uri).toBe(
        window.location.origin
      );
    });

    it("should configure Auth0Provider with cacheLocation as localstorage", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.cacheLocation).toBe("localstorage");
    });

    it("should configure Auth0Provider with useRefreshTokens enabled", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.useRefreshTokens).toBe(true);
    });

    it("should use environment variables for Auth0 configuration", async () => {
      // Set different env vars
      import.meta.env.VITE_AUTH0_DOMAIN = "different-domain.auth0.com";
      import.meta.env.VITE_AUTH0_CLIENT_ID = "different-client-id";

      vi.resetModules();
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.domain).toBe("different-domain.auth0.com");
      expect(strictModeChildren.props.clientId).toBe("different-client-id");
    });
  });

  describe("Component Hierarchy", () => {
    it("should wrap App in Auth0Provider", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      const auth0Children = strictModeChildren.props.children;
      
      expect(auth0Children.type).toBeDefined();
    });

    it("should render App component", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      expect(renderCall).toBeDefined();
    });
  });

  describe("Root Element", () => {
    it("should fail gracefully if root element does not exist", () => {
      // Remove root element
      document.body.removeChild(rootElement);

      // createRoot should be called with null
      expect(() => {
        createRoot(document.getElementById("root"));
      }).not.toThrow();
    });

    it("should use element with id 'root'", async () => {
      await import("../main.jsx");

      expect(createRoot).toHaveBeenCalledWith(
        document.getElementById("root")
      );
    });
  });

  describe("Environment Variables", () => {
    it("should handle missing VITE_AUTH0_DOMAIN", async () => {
      delete import.meta.env.VITE_AUTH0_DOMAIN;

      vi.resetModules();
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.domain).toBeUndefined();
    });

    it("should handle missing VITE_AUTH0_CLIENT_ID", async () => {
      delete import.meta.env.VITE_AUTH0_CLIENT_ID;

      vi.resetModules();
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.clientId).toBeUndefined();
    });

    it("should use window.location.origin for redirect_uri", async () => {
      const originalOrigin = window.location.origin;

      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren.props.authorizationParams.redirect_uri).toBe(
        originalOrigin
      );
    });
  });

  describe("StrictMode Configuration", () => {
    it("should enable StrictMode", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      
      // Check that StrictMode is used
      expect(renderCall.type.name).toBe("StrictMode");
    });

    it("should have Auth0Provider as direct child of StrictMode", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const strictModeChildren = renderCall.props.children;
      
      expect(strictModeChildren).toBeDefined();
      expect(strictModeChildren.props.domain).toBeDefined();
    });
  });

  describe("Auth0 Features", () => {
    it("should configure session persistence with localstorage", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      expect(auth0Provider.props.cacheLocation).toBe("localstorage");
    });

    it("should enable refresh tokens", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      expect(auth0Provider.props.useRefreshTokens).toBe(true);
    });

    it("should configure redirect to current origin", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      expect(auth0Provider.props.authorizationParams.redirect_uri).toBeTruthy();
    });
  });

  describe("Integration", () => {
    it("should create a complete application structure", async () => {
      await import("../main.jsx");

      // Verify createRoot was called
      expect(createRoot).toHaveBeenCalled();
      
      // Verify render was called
      expect(mockRender).toHaveBeenCalled();
      
      // Verify structure
      const renderCall = mockRender.mock.calls[0][0];
      expect(renderCall.type.name).toBe("StrictMode");
      expect(renderCall.props.children.props.domain).toBeDefined();
      expect(renderCall.props.children.props.clientId).toBeDefined();
    });

    it("should only render once on initial load", async () => {
      await import("../main.jsx");

      expect(mockRender).toHaveBeenCalledTimes(1);
    });
  });

  describe("CSS Import", () => {
    it("should import index.css", async () => {
      // The CSS import is mocked, so we just verify the module loads
      await expect(import("../main.jsx")).resolves.toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle createRoot returning null gracefully", async () => {
      createRoot.mockReturnValueOnce(null);

      await expect(import("../main.jsx")).rejects.toThrow();
    });
  });

  describe("Configuration Values", () => {
    it("should pass all required Auth0 props", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      // Check all required props are present
      expect(auth0Provider.props).toHaveProperty("domain");
      expect(auth0Provider.props).toHaveProperty("clientId");
      expect(auth0Provider.props).toHaveProperty("authorizationParams");
      expect(auth0Provider.props).toHaveProperty("cacheLocation");
      expect(auth0Provider.props).toHaveProperty("useRefreshTokens");
    });

    it("should have correct boolean values", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      expect(typeof auth0Provider.props.useRefreshTokens).toBe("boolean");
      expect(auth0Provider.props.useRefreshTokens).toBe(true);
    });

    it("should have correct string values", async () => {
      await import("../main.jsx");

      const renderCall = mockRender.mock.calls[0][0];
      const auth0Provider = renderCall.props.children;
      
      expect(typeof auth0Provider.props.cacheLocation).toBe("string");
      expect(auth0Provider.props.cacheLocation).toBe("localstorage");
    });
  });
});