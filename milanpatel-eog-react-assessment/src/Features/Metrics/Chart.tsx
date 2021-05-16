import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../../store';
import { metricInfo } from './reducer';
import Plot from 'react-plotly.js';

type chartProps = Props;

interface Props {
  dataFromUrql: any;
}

type charts = {
  [key: string]: chartData;
};

interface chartData {
  x: string[];
  y: string[];
  type: string;
  mode: string;
  marker: any;
}

export const Chart = (props: chartProps) => {
  let localCharts: charts = {};
  const metricData = useSelector((state: IState) => state.metric);

  function prepareCharts(): charts {
    let dataFromUrql = props.dataFromUrql;
    let charts: charts = {};

    if (dataFromUrql.data !== undefined) {
      Object.keys(metricData.HistMetricMeasurement).map((key, index) => {
        let histdataforthekey: metricInfo[] = [];
        if (props.dataFromUrql.data !== undefined && props.dataFromUrql.data.getMultipleMeasurements) {
          for (const iterator of props.dataFromUrql.data.getMultipleMeasurements) {
            if (iterator['metric'] === key) {
              histdataforthekey = iterator['measurements'];
            }
          }
        }
        charts[key] = prepareChartData(histdataforthekey.concat(metricData.HistMetricMeasurement[key]));
      });
    }

    return charts;
  }

  function unpackValue(rows: any[], key: string) {
    return rows.map(function(row) {
      return row[key];
    });
  }

  function unpackat(rows: any[], key: string) {
    return rows.map(function(row) {
      return new Date(row[key]).toLocaleTimeString();
    });
  }

  function prepareChartData(measurements: any[]): chartData {
    let preparedchartData: chartData = {
      x: unpackat(measurements, 'at'),
      y: unpackValue(measurements, 'value'),
      type: 'scatter',
      mode: 'lines',
      marker: { color: 'red' },
    };

    return preparedchartData;
  }

  function getCurrentTimeString(): string {
    return new Date().toLocaleTimeString();
  }

  function getthirtyminsTimeString(lastmins: number): string {
    let datetime = new Date();
    datetime.setMinutes(datetime.getMinutes() - lastmins);
    return datetime.toLocaleTimeString();
  }

  function prepareLayout(name: string): any {
    let from = getthirtyminsTimeString(30);
    let to = getCurrentTimeString();

    let layout = {
      width: 800,
      height: 600,
      title: `Chart for ${name}`,
      xaxis: {
        range: [from, to],
        type: 'Date',
      },
    };
    return layout;
  }

  function renderCharts() {
    localCharts = prepareCharts();
    return true;
  }

  if (props.dataFromUrql.data === undefined) {
    return null;
  }

  return (
    <React.Fragment>
      {localCharts !== undefined &&
        metricData.SelectedMetrics.length > 0 &&
        renderCharts() &&
        metricData.SelectedMetrics.map((key: any) => {
          return (
            localCharts[key] !== undefined && (
              <div key={key} style={{ margin: '10px', display: 'inline-block' }}>
                <Plot
                  key={key}
                  data={[
                    {
                      x: localCharts[key].x,
                      y: localCharts[key].y,
                      type: 'scatter',
                      mode: 'lines',
                    },
                  ]}
                  layout={prepareLayout(key)}
                />
              </div>
            )
          );
        })}
    </React.Fragment>
  );
};
