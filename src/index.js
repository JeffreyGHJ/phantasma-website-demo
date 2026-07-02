import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'jquery';
import App from './App';
import Providers from './Providers';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

if ('ethereum' in window) {
	window.ethereum.autoRefreshOnNetworkChange = false;
}
const container = document.getElementById('root');
const root = createRoot(container);
//TODO: uncomment strict mode
root.render(
	// <React.StrictMode>
	<Providers>
		<Router>
			<App />
		</Router>
	</Providers>
	// </React.StrictMode>
);
