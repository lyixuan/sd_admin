import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';

// import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './utils/global';
import './index.less'; // css init
import './theme/antTheme.css'; // ant自定义主题
import './theme/antCustom.css'; // ant局部页面特殊样式，加class前缀

export const history = createHistory();
// 1. Initialize
const app = dva({ history });

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/baseModels/global').default);
app.model(require('./models/baseModels/login').default);
app.model(require('./models/baseModels/menu').default);

// 4. Router
app.router(require('./router').default);
// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
