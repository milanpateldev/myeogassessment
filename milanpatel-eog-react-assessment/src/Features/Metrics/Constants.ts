export const query = `
  {
    getMetrics
   }
  `;

export const queryHistoryData = `
  query($inputs : [MeasurementQuery]) {
    getMultipleMeasurements(input: $inputs) {
    metric,
    measurements{
    at,
    value,
    unit
    }
  }
  }
  `;

export const subscriptionQuery = `
subscription {
  newMeasurement {metric, at, value, unit}
}
`;
