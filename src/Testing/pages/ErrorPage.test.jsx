// Error.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Error from "../../pages/ErrorPage.jsx";
import React from "react";

// mock react-router-dom navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockedNavigate = vi.fn();

describe("Error Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it("renders default error message", () => {
    render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /You do not have permission to access this page/i
      )
    ).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(
      <MemoryRouter>
        <Error message="Custom error message" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Custom error message/i)).toBeInTheDocument();
  });

  it("navigates when button is clicked", () => {
    render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Go to Landing Page/i }));
    expect(mockedNavigate).toHaveBeenCalledWith("/");
  });
});
