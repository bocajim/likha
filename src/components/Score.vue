<template>
  <div>
    <v-alert class="ma-4" v-if="error" dismissible type="error">
      {{ error }}
    </v-alert>
    <v-data-table
        :headers="headers"
        :items="scores"
        hide-default-footer
        disable-sort
        disable-pagination>
      <template v-slot:item.valid="{item}">
        <v-icon v-if="item.valid==='new'" @click="add(item)">mdi-plus-circle</v-icon>
        <v-icon v-else-if="item.valid==='total'">mdi-sigma</v-icon>
        <v-icon v-else :color="validate(item).color">{{validate(item).icon}}</v-icon>
      </template>
      <template v-slot:item.player0="{item}">
        <div v-if="item.valid!=='new'">
          <v-chip v-if="item.valid==='total'" :color="highscore(item.player0)" class="white--text">{{ item.player0 }}</v-chip>
          <div v-else>{{ item.player0 }}</div>
        </div>
        <v-edit-dialog v-else
            :return-value.sync="item.player0"
        > {{ item.player0 }}
          <template v-slot:input>
            <v-text-field
                v-model="item.player0"
                label="Edit"
                value=""
                single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.player1="{item}">
        <div v-if="item.valid!=='new'">
          <v-chip v-if="item.valid==='total'" :color="highscore(item.player1)" class="white--text">{{ item.player1 }}</v-chip>
          <div v-else>{{ item.player1 }}</div>
        </div>
        <v-edit-dialog v-else
            :return-value.sync="item.player1"
        > {{ item.player1 }}
          <template v-slot:input>
            <v-text-field
                v-model="item.player1"
                label="Edit"
                single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.player2="{item}">
        <div v-if="item.valid!=='new'">
          <v-chip v-if="item.valid==='total'" :color="highscore(item.player2)" class="white--text">{{ item.player2 }}</v-chip>
          <div v-else>{{ item.player2 }}</div>
        </div>
        <v-edit-dialog v-else
            :return-value.sync="item.player2"
        > {{ item.player2 }}
          <template v-slot:input>
            <v-text-field
                v-model="item.player2"
                label="Edit"
                single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.player3="{item}">
        <div v-if="item.valid!=='new'">
          <v-chip v-if="item.valid==='total'" :color="highscore(item.player3)" class="white--text">{{ item.player3 }}</v-chip>
          <div v-else>{{ item.player3 }}</div>
        </div>
        <v-edit-dialog v-else
            :return-value.sync="item.player3"
        > {{ item.player3 }}
          <template v-slot:input>
            <v-text-field
                v-model="item.player3"
                label="Edit"
                single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
    </v-data-table>
    <div class="text-right">
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="blue lighten-2" text dark v-bind="attrs" v-on="on">
            Change players
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2">
            Player names
          </v-card-title>

          <v-card-text>
            <v-text-field v-model="headers[1].text"></v-text-field>
            <v-text-field v-model="headers[2].text"></v-text-field>
            <v-text-field v-model="headers[3].text"></v-text-field>
            <v-text-field v-model="headers[4].text"></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

class Record {
  valid: string
  player0: number
  player1: number
  player2: number
  player3: number

  constructor() {
    this.valid = 'new'
    this.player0 = 0
    this.player1 = 0
    this.player2 = 0
    this.player3 = 0
  }
}

@Component({
  components: {}
})
export default class Score extends Vue {

  error: any = '';

  dialog = false;

  players: string[] = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

  headers = [
    {
      text: 'Valid',
      value: 'valid',
      align: 'center'
    },
    {
      text: this.players[0],
      value: 'player0',
      align: 'center'
    },
    {
      text: this.players[1],
      value: 'player1',
      align: 'center'
    },
    {
      text: this.players[2],
      value: 'player2',
      align: 'center'
    },
    {
      text: this.players[3],
      value: 'player3',
      align: 'center'
    }
  ]

  scores: Record[] = [
    {valid: 'total', player0: 0, player1: 0, player2: 0, player3: 0},
    {valid: 'new', player0: 0, player1: 0, player2: 0, player3: 0}
  ];

  validate(item: Record): { color: string; icon: string } {
    const sum = (+item.player0) + (+item.player1) + (+item.player2) + (+item.player3);
    if(sum === 36 ) {
      return {color: 'green', icon:'mdi-check-circle'}
    } else {
      return {color: 'red', icon:'mdi-contrast-circle'}
    }
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
    } else {
      this.error = 'Values must add up to 36, currently '+sum
    }
  }

  highscore(num: number): string {
    if(num>90) return 'red darken';
    if(num>80) return 'orange darken';
    if(num>70) return 'yellow darken';
    if(num>40) return 'blue darken';
    else return 'green darken';
  }
}
</script>

<style scoped>

</style>
