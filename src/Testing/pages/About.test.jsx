import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import About from "@/pages/About";

describe("About Page", () => {
  it("renders the page heading and description", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /about planit/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/PlanIt is your all-in-one event planning platform/i)
    ).toBeInTheDocument();
  });

  it("renders all team members", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    const members = [
      "Kutlwano",
      "Ntando",
      "Given",
      "Freddo",
      "Molemo",
      "Ntobeko",
    ];

    members.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("renders contact section", () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /contact us/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/support@planit.com/i)).toBeInTheDocument();
    expect(
      screen.getByText(/call \+1 555-000-0000/i)
    ).toBeInTheDocument();
  });

  it("renders footer with links", () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  );

  // Find the footer element
  const footer = screen.getByRole("contentinfo");

  // Now search inside the footer only
  expect(
    within(footer).getByRole("heading", { name: "PlanIt" })
  ).toBeInTheDocument();

  // Footer About link
  expect(
    within(footer).getByRole("link", { name: /about/i })
  ).toHaveAttribute("href", "/about");
});

  it("navigates when clicking Features button", () => {
    delete window.location;
    window.location = { href: "" };

    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /features/i }));
    expect(window.location.href).toBe("/#hero");
  });
});
