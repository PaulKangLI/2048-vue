<template>
  <div>
    <div>
      <h1>2048</h1>
      <score class="scores" :width="width" />
    </div>
    <configuration class="configuration" :initalTiles="initalTiles" />
    <menu-section class="menu-section" :initalTiles="initalTiles" />
  </div>
</template>

<script>
import Score from "../components/Score.vue";
import Configuration from "../components/Configuration.vue";
import MenuSection from "../components/MenuSection.vue";

export default {
  name: "HeaderView",
  components: {
    Score,
    Configuration,
    MenuSection,
  },
  props: {
    initalTiles: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
h1 {
  font-size: 4.2em;
  margin: 0;
  display: inline-block;
}
.scores {
  float: right;
  display: flex;
}
.configuration {
  display: flex;
  text-align: center;
  padding-top: 1.4em;
  font-size: 1em;
  white-space: nowrap;
  justify-content: flex-end;
}
.menu-section {
  text-align: right;
  padding: 1.4em 0;
  font-size: 1em;
  white-space: nowrap;
}
</style>