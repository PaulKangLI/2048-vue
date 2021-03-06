import Vue from "vue";
import Vuex from "vuex";
import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";
// const LOG = window._env_.LOG;

Vue.use(Vuex);

const state = () => ({
  tiles: [],
  grids: [],
  stats: {
    currentScore: 0,
    bestScore: 0,
  },
  isCollided: false,
  status: {
    gameEnd: false,
    win: false,
    gameOver: false,
    keepGoing: false,
  },
  undoSteps: [],
  maxUndoStepsAmount: 1,
  winTileValue: 2048,
  boardSize: [4, 4], //row, column
});

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  state,
  getters,
  mutations,
  actions,
  modules: {},
});

store.subscribe((mutation, state) => {
  // LOG && window.console.log(state, "state");
  localStorage.setItem("state", JSON.stringify(state));
});

export default store;
