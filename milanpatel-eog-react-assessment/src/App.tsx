import React from 'react';
import createStore from './store';
import { Provider as Pro } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import { Subscriber } from './Features/Metrics/Subscriber';
import { Provider, createClient, defaultExchanges, subscriptionExchange, Query } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Main } from './Features/Metrics/Main';
import { query } from './Features/Metrics/Constants';

const store = createStore();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const subscriptionClient = new SubscriptionClient(`ws://react.eogresources.com/graphql`, {
  reconnect: true,
  timeout: 20000,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Pro store={store}>
      <Wrapper>
        <Header />
        <ToastContainer />
        <Provider value={client}>
          <Subscriber />
          <Query query={query} requestPolicy="network-only">
            {queryResults => <Main datafromurql={queryResults} />}
          </Query>
        </Provider>
      </Wrapper>
    </Pro>
  </MuiThemeProvider>
);

export default App;
