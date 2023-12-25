import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Tasks from './Tasks/Tasks';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Tasks />
    </Provider>
  );
};

export default App;
