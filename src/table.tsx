import { Feature, MultiPolygon } from "geojson";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { RampProperties } from "./types";

export const RampTable = ({
  ramps,
}: {
  ramps: Feature<MultiPolygon, RampProperties>[];
}) => {
  const data = useMemo(() => ramps.map((f) => f.properties), [ramps]);

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Condition</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Last updated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.rec_id}>
              <TableCell>{row.rec_id}</TableCell>
              <TableCell>{row.material}</TableCell>
              <TableCell>{row.area_}</TableCell>
              <TableCell>{row.condition}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>{row.update_dat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
