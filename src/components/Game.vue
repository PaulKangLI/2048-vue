<template>
  <div ref="game">
    <board class="board" />
    <tile
      class="tile-item"
      v-for="(tile, index) in tiles"
      :key="index"
      :tile="tile"
    />
  </div>
</template>

<script>
import addSwipeListenner from "../utils/swipe.js";
import Board from "./Board.vue";
import Tile from "./Tile.vue";
const LOG = window._env_.LOG;

export default {
  components: {
    Board,
    Tile,
  },
  props: {
    initalTiles: {
      type: Number,
      required: true,
    },
  },
  computed: {
    tiles() {
      return this.$store.state.tiles;
    },
    boardSize() {
      return this.$store.state.boardSize;
    },
    grids() {
      return this.$store.state.grids;
    },
    isCollided() {
      return this.$store.state.isCollided;
    },
    winTileValue() {
      return this.$store.state.winTileValue;
    },
    keepGoing() {
      return this.$store.state.status.keepGoing;
    },
  },
  created() {
    if (this.tiles.length === 0) {
      this.$store.dispatch("RestartGame").then(() => {
        // Every turn, two new tiles randomly appear in an empty spot on the board
        // with a value of either 2 or 4.
        for (let index = 0; index < this.initalTiles; index++) {
          this.$store.dispatch("GenerateOneRandomTile");
          if (index + 1 === this.initalTiles)
            this.$store.commit("addUndoSteps");
        }
      });
    }
  },
  mounted() {
    this.addKeyAndSwipe();
  },
  detroyed() {
    document.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    addKeyboard() {
      document.addEventListener("keydown", this.onKeyDown);
    },
    addKeyAndSwipe() {
      // add keydown event
      document.addEventListener("keydown", this.onKeyDown);
      // add touch event
      addSwipeListenner(this.$refs.game, this.move);
      // LOG && window.console.log(this.$refs.game);
    },
    onKeyDown(evt) {
      let keyCode = { 38: "↑", 40: "↓", 37: "←", 39: "→" };
      let direction = keyCode[evt.keyCode];
      if (!direction) return;
      this.move(evt.key);
      evt.preventDefault();
    },
    // The game is over when no tile can slide in any direction
    isGameOver() {
      return !(
        this.canTilesSlideUp() ||
        this.canTilesSlideDown() ||
        this.canTilesSlideLeft() ||
        this.canTilesSlideRight()
      );
    },
    // The game is won when a tile with a value of 2048 appears on the board,
    isWin() {
      if (!this.keepGoing) {
        const [row, column] = this.boardSize;
        let maxValue = 0;
        for (let i = 0; i < row; i++) {
          for (let j = 0; j < column; j++) {
            if (maxValue < this.grids[i][j]) {
              maxValue = this.grids[i][j];
            }
          }
        }
        return maxValue === this.winTileValue;
      }
    },
    canTilesSlideUp() {
      const [row, column] = this.boardSize;
      // LOG && window.console.log(this.grids, "grids");
      for (let i = 0; i < column; i++) {
        for (let j = 0; j < row - 1; j++) {
          // LOG && window.console.log(this.grids[j][i], j, i, "grid");
          // LOG && window.console.log(this.grids[j + 1][i], j, i, "grid");
          // The tile itself is not 0, it is the same as its down neighbor
          // [0][0]
          // [1][0]
          if (this.grids[j][i] > 0 && this.grids[j][i] === this.grids[j + 1][i])
            return true;

          // The tile itself is 0, its down neighbor is not 0
          if (this.grids[j][i] === 0 && this.grids[j + 1][i] > 0) return true;
        }
      }
      return false;
    },
    canTilesSlideDown() {
      const [row, column] = this.boardSize;
      // LOG && window.console.log(this.grids, "grids");
      for (let i = 0; i < column; i++) {
        for (let j = 0; j < row - 1; j++) {
          // LOG && window.console.log(this.grids[j + 1][i], j, i, "grid");
          // LOG && window.console.log(this.grids[j][i], j, i, "grid");
          // The tile itself is not 0, it is the same as its up neighbor
          if (
            this.grids[j + 1][i] > 0 &&
            this.grids[j + 1][i] === this.grids[j][i]
          )
            return true;

          // The tile itself is 0, its up neighbor is not 0
          if (this.grids[j + 1][i] === 0 && this.grids[j][i] > 0) return true;
        }
      }
      return false;
    },
    canTilesSlideLeft() {
      const [row, column] = this.boardSize;
      // LOG && window.console.log(this.grids, "grids");
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < column - 1; j++) {
          // LOG && window.console.log(this.grids[i][j + 1], i, j, "grid");
          // LOG && window.console.log(this.grids[i][j], i, j, "grid");
          // The tile itself is 0, its right neighbor is not 0
          if (this.grids[i][j] === 0 && this.grids[i][j + 1] > 0) return true;

          // The tile itself is not 0, it is the same as its right neighbor
          if (this.grids[i][j] > 0 && this.grids[i][j] === this.grids[i][j + 1])
            return true;
        }
      }
      return false;
    },
    canTilesSlideRight() {
      const [row, column] = this.boardSize;
      LOG && window.console.log(this.grids, "grids");
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < column - 1; j++) {
          // LOG && window.console.log(this.grids[i][j], i, j, "grid");
          // LOG && window.console.log(this.grids[i][j + 1], i, j, "grid");
          // The tile itself is 0, its left neighbor is not 0
          if (this.grids[i][j + 1] === 0 && this.grids[i][j] > 0) return true;

          // The tile itself is not 0, it is the same as its left neighbor
          if (
            this.grids[i][j + 1] > 0 &&
            this.grids[i][j + 1] === this.grids[i][j]
          )
            return true;
        }
      }
      return false;
    },
    generateOneRandomTile() {
      if (!this.isCollided) this.$store.dispatch("GenerateOneRandomTile");
    },
    move(direction) {
      switch (direction) {
        case "ArrowUp": {
          LOG && window.console.log("ArrowUp");
          if (this.canTilesSlideUp()) {
            this.$store.dispatch("TilesSlideUp").then(() => {
              this.generateOneRandomTile();
              this.$store.commit("addUndoSteps");
            });
          }
          break;
        }
        case "ArrowDown": {
          LOG && window.console.log("ArrowDown");
          if (this.canTilesSlideDown()) {
            this.$store.dispatch("TilesSlideDown").then(() => {
              this.generateOneRandomTile();
              this.$store.commit("addUndoSteps");
            });
          }
          break;
        }
        case "ArrowLeft": {
          LOG && window.console.log("ArrowLeft");
          if (this.canTilesSlideLeft()) {
            this.$store.dispatch("TilesSlideLeft").then(() => {
              this.generateOneRandomTile();
              this.$store.commit("addUndoSteps");
            });
          }
          break;
        }
        case "ArrowRight": {
          LOG && window.console.log("ArrowRight");
          if (this.canTilesSlideRight()) {
            this.$store.dispatch("TilesSlideRight").then(() => {
              this.generateOneRandomTile();
              this.$store.commit("addUndoSteps");
            });
          }
          break;
        }
        default:
          LOG && window.console.log("Something went wrong!");
      }

      if (this.isGameOver()) {
        document.removeEventListener("keydown", this.onKeyDown);
        this.$store.commit("setStatus", {
          gameEnd: true,
          win: false,
          gameOver: true,
          keepGoing: false,
        });
      }

      if (this.isWin()) {
        document.removeEventListener("keydown", this.onKeyDown);
        this.$store.commit("setStatus", {
          gameEnd: true,
          win: true,
          gameOver: false,
          keepGoing: false,
        });
      }
    },
  },
};
</script>

<style scoped>
</style>