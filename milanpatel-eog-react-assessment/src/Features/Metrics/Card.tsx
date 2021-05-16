import React from 'react';
import { IState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { actions as metricactions } from './reducer';

type cardProps = Props;

interface Props {
  metricName: string;
}

export const Card = (props: cardProps) => {
  const statevalue = useSelector((state: IState) => {
    return state.metric;
  });
  const currentSelectedMetric = statevalue.CurrentMetricMeasurement[props.metricName];
  const dispatch = useDispatch();

  const close = () => {
    dispatch(metricactions.metricRemoved({ selectedMetric: props.metricName }));
  };

  return (
    <React.Fragment>
      <div style={{ width: '150px', height: '100px', backgroundColor: 'green', margin: '10px' }}>
        <div style={{ float: 'right' }}>
          <button
            onClick={() => {
              close();
            }}
          >
            X
          </button>
        </div>
        <div>{props.metricName}</div>
        <div key={props.metricName} style={{ textAlign: 'center', margin: '4px' }}>
          {currentSelectedMetric !== undefined && currentSelectedMetric.value}
        </div>
      </div>
    </React.Fragment>
  );
};
