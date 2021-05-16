import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { actions as metricactions } from '../Metrics/reducer';
import { useSubscription } from 'urql';
import { subscriptionQuery } from './Constants';

export const Subscriber = ({}) => {
  const [subscriptionResponse] = useSubscription({ query: subscriptionQuery });
  const { fetching, data, error } = subscriptionResponse;

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      return;
    }

    if (!data) return;

    const { newMeasurement } = data;

    dispatch(metricactions.metricDataReceived({ metricName: newMeasurement['metric'], metricValue: newMeasurement }));
  }, [dispatch, data, error, fetching]);

  return null;
};
