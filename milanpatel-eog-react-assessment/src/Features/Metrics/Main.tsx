import React, { useEffect } from 'react';
import { IState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { actions as metricactions } from './reducer';
import { Query } from 'urql';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import { Card } from './Card';
import { Chart } from './Chart';
import { queryHistoryData } from './Constants';

interface Mainprops {
  datafromurql: any;
}

type MeasurementQuery = {
  metricName: string;
  after: number;
  before: number;
};

export const Main = (props: Mainprops) => {
  const datafromurql = props.datafromurql;
  const metricNames: string[] = ['select a metric'];
  const dispatch = useDispatch();
  const [selectedFilter] = React.useState('select a metric');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(metricactions.metricSelected({ selectedMetric: event.target.value as string }));
  };

  const getSelectedMetrics = (state: IState) => {
    return { selectedMetrics: state.metric.SelectedMetrics };
  };

  const getInputs = (state: IState) => {
    let inputs: MeasurementQuery[] = [];
    let dateval = new Date();
    let beforedateval = dateval.getTime();
    let after = beforedateval - 30 * 60 * 1000;
    for (const iterator of state.metric.SelectedMetrics) {
      inputs.push({ metricName: iterator, after: after, before: beforedateval });
    }
    return {
      inputs,
    };
  };

  const { selectedMetrics } = useSelector(getSelectedMetrics);
  const { inputs } = useSelector(getInputs);

  if (!datafromurql.fetching && metricNames.length <= 1) {
    for (const iterator of datafromurql.data.getMetrics) {
      metricNames.push(iterator);
    }
  }

  useEffect(() => {}, [selectedMetrics]);

  return (
    <React.Fragment>
      {metricNames !== undefined && metricNames.length > 0 && (
        <Select labelId="metrics-label" id="metrics" value={selectedFilter} onChange={handleChange}>
          {metricNames.map(x => (
            <MenuItem key={x} value={x}>
              {x}
            </MenuItem>
          ))}
        </Select>
      )}

      {selectedMetrics.length > 0 && (
        <div style={{ margin: '20px' }}>
          <h3>Selected Metrics</h3>
        </div>
      )}

      {selectedMetrics.length > 0 && selectedMetrics.map((x: string) => <Card key={x} metricName={x} />)}

      {selectedMetrics.length > 0 && (
        <Query query={queryHistoryData} variables={{ inputs }} requestPolicy="network-only">
          {queryResults => (
            <div>
              <Chart dataFromUrql={queryResults} />
            </div>
          )}
        </Query>
      )}
    </React.Fragment>
  );
};
