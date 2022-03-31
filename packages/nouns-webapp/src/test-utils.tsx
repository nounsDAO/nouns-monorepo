// see https://testing-library.com/docs/react-testing-library/setup/#custom-render
// and use:
// - import { render, fireEvent } from '@testing-library/react';
// + import { render, fireEvent } from '../test-utils';
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore, { history } from './store';

const AllTheProviders: FC = ({ children }) => {
  return (
    <Provider store={configureStore({})}>
      <ConnectedRouter history={history}>
        <React.StrictMode>{children}</React.StrictMode>
      </ConnectedRouter>
    </Provider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
