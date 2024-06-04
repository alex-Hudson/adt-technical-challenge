import { Box, Card, Grid } from "@mui/material";
import { Feature, MultiPolygon } from "geojson";
import { RampData, RampProperties } from "./types";
import React, { useEffect, useState, useReducer } from "react";
import { TasksContext, TasksDispatchContext } from "./visible-features-context";

import { BoatMatterialsBar } from "./materials-bar-chart";
import { Header } from "./header";
import { Map } from "./map";
import { RampTable } from "./table";
import { ErrorBoundary } from "react-error-boundary";
import tasksReducer from "./visible-features-reducer";

export const App = () => {
  const [data, setData] = useState<RampData | undefined>(undefined);
  const [visibleFeatures, setVisibleFeatures] = useState<
    Feature<MultiPolygon, RampProperties>[] | []
  >([]);

  const [temp, dispatch] = useReducer(tasksReducer, visibleFeatures);

  console.log(temp)
  const getData = async () => {
    const results = await fetch("./data.json");
    setData(await results.json());
  };


  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    if (data) {
      setVisibleFeatures(data.features);

      dispatch({
        type: 'changed',
        visibleFeatures: data.features,
      });
    }
  }, [data])

  return data === undefined ? (
    <div>Loading...</div>
  ) : (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} margin={3}>
      <TasksContext.Provider value={temp}>
      <TasksDispatchContext.Provider value={dispatch}>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Card elevation={2} sx={{ height: 400 }}>
              <Map
                ramps={data}
                visibleFeatures={visibleFeatures}
                setVisibleFeatures={setVisibleFeatures}
              />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card elevation={2} sx={{ height: 400 }}>
              <BoatMatterialsBar ramps={data} />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card elevation={2} sx={{ overflow: "hidden" }}>
              <RampTable ramps={visibleFeatures} />
            </Card>
          </Grid>
        </Grid>
        </TasksDispatchContext.Provider>
        </TasksContext.Provider>
      </Box>
    </>
  );
};
