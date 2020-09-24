<template>
  <div>
    <div v-if="item.valid!=='new'">
      <div v-if="item.valid==='total'">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-chip  v-bind="attrs" v-on="on" :color="highscore(item[player])" class="white--text">{{ item[player] }}</v-chip>
          </template>
          <span>{{101 - (+item[player])}} remaining</span>
        </v-tooltip>
      </div>
      <div v-else>{{ item[player] }}</div>
    </div>
    <v-edit-dialog v-else :return-value.sync="item[player]" @open="item[player] = ''"> {{ item[player] }}
      <template v-slot:input>
        <v-text-field
            v-model="item[player]"
            label="Edit"
            value=""
            type="number"
            :hint="remaining(item)"
            single-line
        ></v-text-field>
      </template>
    </v-edit-dialog>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import {Record} from '@/record'

@Component({
  components: {}
})
export default class Entry extends Vue {

  @Prop()
  item: any;

  @Prop()
  player: any;

  @Prop()
  scores: any;

  validate(item: Record): { color: string; icon: string } {
    const sum = (+item.player0) + (+item.player1) + (+item.player2) + (+item.player3);
    if(sum === 36 ) {
      return {color: 'green', icon:'mdi-plus-circle'}
    } else {
      return {color: 'red', icon:'mdi-contrast-circle'}
    }
  }

  sum(item: Record): number {
    return (+item.player0) + (+item.player1) + (+item.player2) + (+item.player3);
  }

  add(item: Record) {
    const sum = (+item.player0) + (+item.player1) + (+item.player2) + (+item.player3);
    if( sum === 36 ) {
      item.valid = 'valid'
      this.scores[0].player0 += +item.player0
      this.scores[0].player1 += +item.player1
      this.scores[0].player2 += +item.player2
      this.scores[0].player3 += +item.player3
      this.scores.push({valid: 'new', player0: 0, player1: 0, player2: 0, player3: 0})
    }
  }

  highscore(num: number): string {
    if(num>90) return 'red darken-4';
    if(num>80) return 'orange darken-4';
    if(num>70) return 'yellow darken-4';
    if(num>40) return 'blue darken-4';
    else return 'green darken-4';
  }

  remaining(item: Record): string {
    const rem = 36 - (+item.player0) - (+item.player1) - (+item.player2) - (+item.player3);
    return rem.toString() + ' remaining'
  }
}
</script>

<style scoped>

</style>
