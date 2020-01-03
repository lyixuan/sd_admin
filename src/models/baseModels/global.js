import {getThemeData} from '../../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: true,
    notices: [],
    tempLogo: null,
    headerBackgroundColor: null,
    layoutBackgroundColor: null,
    headerImage: null,
    layoutImage: null,
    pmsdkImage: null,
    animation: null
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *getThemeInfo({payload}, {call, put}) {
      let res = yield call(getThemeData);
      if (res && res.code === 20000) {
        let data = res.data;
        yield put({
          type: 'saveThemeData',
          payload: data
        })
      } else {}
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveThemeData(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        document.documentElement.scrollTop = 0;
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
