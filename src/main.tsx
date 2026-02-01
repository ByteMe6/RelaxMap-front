import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ReviewProvider } from "./pages/LocationDeteilsPage/ReviewsContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <Provider store={ store }>
          <ReviewProvider>
            <App/>
          </ReviewProvider>
        </Provider>
      </HashRouter>
    </React.StrictMode>,
);
