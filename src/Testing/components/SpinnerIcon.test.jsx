import { render, screen } from "@testing-library/react";
import Spinner from "@/components/SpinnerIcon";

describe("SpinnerIcon", () => {
  it("renders the spinner overlay", () => {
    render(<Spinner />);
    // Overlay section should be present
    const overlay = screen.getByRole("region", { hidden: true });
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass("fixed", "inset-0", "bg-black");
  });

  it("renders the spinning element", () => {
    render(<Spinner />);
    // Find the inner spinning section by class
    const spin = screen.getByRole("region", { hidden: true }).querySelector(".animate-spin");
    expect(spin).toBeInTheDocument();
    expect(spin).toHaveClass("rounded-full", "h-16", "w-16", "border-t-4", "border-green-700");
  });
});