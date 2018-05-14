import React from 'react';
import { Router, Route, Switch,routerRedux} from 'dva/router';
import dynamic from 'dva/dynamic';
// import IndexPage from './routes/IndexPage';
const { ConnectedRouter } = routerRedux;




function RouterConfig({history, app}) {
  const Home = dynamic({
    app,
    models: () => [
      import('./models/index'),
      import('./models/login'),
      import('./models/Strick'),
      import('./models/mine'),
      import('./models/CreditDetails'),
      import('./models/DataIndex'),
      import('./models/CreditDetails'),
      import('./models/GroupDialog'),
    ],
    component: () => import('./routes/Home'),
  });
  const Login = dynamic({
    app,
    models: () => [
      import('./models/login'),
    ],
    component: () => import('./routes/Login'),
  });
  const DataIndex = dynamic({
    app,
    models: () => [
      import('./models/DataIndex'),
    ],
    component: () => import('./routes/DataList/DataIndex'),
  });

  const UseCourse = dynamic({
    app,
    component: () => import('./routes/User/UseCourse'),
  });

  const UseOpinion = dynamic({
    app,
    component: () => import('./routes/User/UseOpinion'),
  });
  const UserIndex = dynamic({
    app,
    component: () => import('./routes/User/UserIndex'),
  });
  const ChartsList = dynamic({
    app,
    component: () => import('./routes/CreditInfo/ChartsList'),
  });


  const ErrorPage = dynamic({
    app,
    component: () => import('./routes/ErrorPage'),
  });

  const CreditDetails = dynamic({
    app,
    models: () => [
      import('./models/CreditDetails'),
    ],
    component: () => import('./routes/Credit/CreditDetails'),
  });
  const NewCreditDetails = dynamic({
    app,
    component: () => import('./routes/Credit/NewCreditDetails'),
  });
  const IndexPage = dynamic({
    app,
    component: () => import('./routes/IndexPage'),
  });


  return (
    <ConnectedRouter history={history}>
      <Switch>
      <Route path="/" exact component={Home} />
        <Route path="/" exact component={Home}/>
        <Route exact path="/home" component={Home}/>
        <Route path="/DataIndex" component={DataIndex}/>
        <Route path="/Login" component={Login}/>
        <Route path="/UseCourse" component={UseCourse}/>
        <Route path="/UseOpinion" component={UseOpinion}/>
        <Route path="/UserIndex" component={UserIndex}/>
        <Route path="/chartsList" component={ChartsList}/>
        <Route path="/errorPage" component={ErrorPage}/>
        <Route path="/CreditDetails" component={CreditDetails}/>
        <Route path="/NewCreditDetails" component={NewCreditDetails}/>
        </Switch>
      </ConnectedRouter>
  );
}





// function RouterConfig({ history }) {
//   return (
//     <Router history={history}>
//       <Switch>
//         <Route path="/" exact component={IndexPage} />
//       </Switch>
//     </Router>
//   );
// }

export default RouterConfig;
