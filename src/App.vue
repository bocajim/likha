<template>
  <v-app>
    <v-main>
      <Score></Score>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Score from "@/components/Score.vue";

@Component({
  components: {
    Score
  }
})
export default class extends Vue {

}
</script>
