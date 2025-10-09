import { render, screen } from "@testing-library/react";
import TeamCard from "@/components/TeamCard";

describe("TeamCard", () => {
  const props = {
    name: "Alice Smith",
    role: "Developer",
    email: "alice@example.com",
    phone: "123-456-7890",
  };

  it("renders the card with name and role", () => {
    render(<TeamCard {...props} />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("renders initials in the avatar", () => {
    render(<TeamCard {...props} />);
    expect(screen.getByText("AS")).toBeInTheDocument();
  });

  it("applies correct classes for styling", () => {
    render(<TeamCard {...props} />);
    const card = screen.getByText("Alice Smith").closest("div");
    expect(card).toHaveClass("bg-white", "rounded-2xl", "shadow-lg");
  });

  it("renders role with teal color", () => {
    render(<TeamCard {...props} />);
    const role = screen.getByText("Developer");
    expect(role).toHaveClass("text-teal-600");
  });
});