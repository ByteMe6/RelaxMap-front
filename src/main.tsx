import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { ReviewProvider } from "./pages/LocationDeteilsPage/ReviewsContext.tsx";
        
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ReviewProvider>
            <App />
           </ReviewProvider>
        </PersistGate>
      </Provider>
    </HashRouter>
  </React.StrictMode>,
);