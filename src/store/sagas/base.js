import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/base';
import { BASE_URL } from 'common/constants';
import { toast } from 'react-toastify';




export function* loadKG() {
  try {
    const kg_res = yield axios.get(BASE_URL + 'katastralgemeinde/?limit=10000');
    if (kg_res.status === 200) {
      yield put(actions.setKGs(kg_res.data.results.map((v,i) => ( {label: v.kg_nr + ' - '+v.kg, value: v.kg_nr })) ));
    } else {
      toast.error("KGs konnten nicht geladen werden")
    }
  } catch (err) {
    toast.error("KGs konnten nicht geladen werden")
  }
}