import { render, screen } from "@testing-library/react";
import { FilterArrow } from "../Components/FilterArrow";
import "@testing-library/jest-dom";
import React from "react";

describe("FilterArrow component", () => {
  it("should rotate 90 degrees when filter is true", () => {
    const { container } = render(<FilterArrow filter={true} />);
    console.log(container.innerHTML);
    const arrow = screen.getByTestId("angle-right");
    expect(arrow.parentElement).toHaveStyle({ transform: "rotate(90deg)" });
  });

  it("should not rotate when filter is false", () => {
    const { container } = render(<FilterArrow filter={false} />);
    console.log(container.innerHTML);
    const arrow = screen.getByTestId("angle-right");
    expect(arrow.parentElement).toHaveStyle({ transform: "rotate(0deg)" });
  });
});
