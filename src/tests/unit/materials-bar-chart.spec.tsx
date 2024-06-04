import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BoatMatterialsBar } from "../../materials-bar-chart";
import { RampData } from "../../types";
import { BarChart } from "recharts";

jest.mock("recharts", () => ({
  BarChart: jest.fn(({ children }) => (
    <div data-testid="BarChart">{children}</div>
  )),
  Bar: jest.fn(() => <div data-testid="Bar" />),
  CartesianGrid: jest.fn(() => <div data-testid="CartesianGrid" />),
  XAxis: jest.fn(() => <div data-testid="XAxis" />),
  YAxis: jest.fn(() => <div data-testid="YAxis" />),
  Tooltip: jest.fn(() => <div data-testid="Tooltip" />),
  Legend: jest.fn(() => <div data-testid="Legend" />),
  ResponsiveContainer: jest.fn(({ children }) => (
    <div data-testid="ResponsiveContainer">{children}</div>
  )),
}));

const sampleRamps: RampData = {
  features: [
    { properties: { material: "Wood" } },
    { properties: { material: "Steel" } },
    { properties: { material: "Wood" } },
    { properties: { material: "Concrete" } },
  ],
};

describe("BoatMatterialsBar Component", () => {
  test("renders without crashing", () => {
    render(<BoatMatterialsBar ramps={sampleRamps} />);
    expect(screen.getByTestId("ResponsiveContainer")).toBeInTheDocument();
  });

  test("calculates data correctly", () => {
    const { container } = render(<BoatMatterialsBar ramps={sampleRamps} />);
    const chartData = container.querySelector('[data-testid="BarChart"]');
    expect(chartData).toBeInTheDocument();

    // Check if the BarChart component is receiving the correct data
    const data = BarChart.mock.calls[0][0].data;
    expect(data).toEqual([
      { id: "Wood", value: 2 },
      { id: "Steel", value: 1 },
      { id: "Concrete", value: 1 },
    ]);
  });

  test("renders chart components correctly", () => {
    render(<BoatMatterialsBar ramps={sampleRamps} />);
    expect(screen.getByTestId("CartesianGrid")).toBeInTheDocument();
    expect(screen.getByTestId("XAxis")).toBeInTheDocument();
    expect(screen.getByTestId("YAxis")).toBeInTheDocument();
    expect(screen.getByTestId("Tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("Legend")).toBeInTheDocument();
    expect(screen.getByTestId("Bar")).toBeInTheDocument();
  });

  test("displays error boundary message on error", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<BoatMatterialsBar ramps={12343} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});
