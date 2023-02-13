import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, storageRedux } from './redux/storageRedux';
import GlobalStyle from './components/GlobalStyles';
// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={storageRedux}>
        <PersistGate loading={null} persistor={persistor}>
            {/* <React.StrictMode> */}
                <GlobalStyle>
                    <App />
                </GlobalStyle>
            {/* </React.StrictMode> */}
        </PersistGate>
    </Provider>,
);
