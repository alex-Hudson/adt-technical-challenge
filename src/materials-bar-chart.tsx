import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDatum, RampData } from "./types";

import { ErrorBoundary } from "react-error-boundary";
import React from "react";

const calculateData = (ramps: RampData) => {
  const data: ChartDatum[] = [];

  try {
      ramps.features.forEach((feature) => {
      const index = data.findIndex((w) => w.id === feature.properties.material);
      if (index > -1) {
        data[index] = {
          id: feature.properties.material,
          value: data[index].value + 1,
        };
      } else {
        data.push({
          id: feature.properties.material,
          value: 1,
        });
      }
    });
  } catch (ex) {
    console.error(ex);
  }

  return data;
};

export const BoatMatterialsBar = ({ ramps }: { ramps: RampData }) => {
  let data = calculateData(ramps);
  return (
    <ErrorBoundary FallbackComponent={() => <p>Something went wrong</p>}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0190b9" />
        </BarChart>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
};
