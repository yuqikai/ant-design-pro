import { querySoftwareAssetList } from '../services/api';

export default {
  namespace: 'softwareAsset',

  state: {
    data: {
      list: [],
      filter: {},
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySoftwareAssetList, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: response,
      });
    },

  },

  reducers: {
    save(state, action) {
      console.log("save .... software")
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
