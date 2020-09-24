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
        mobile-breakpoint="200"
        disable-pagination>
      <template v-slot:item.valid="{item}">
        <v-icon v-if="item.valid==='new' && sum(item)===36" :color="validate(item).color" @click="add(item)">{{validate(item).icon}}</v-icon>
        <v-icon v-else-if="item.valid==='new'" :color="validate(item).color">{{validate(item).icon}}</v-icon>
        <v-icon v-else-if="item.valid==='total'">mdi-sigma</v-icon>
        <v-icon v-else>mdi-check-circle</v-icon>
      </template>
      <template v-slot:item.player0="{item}">
        <Entry :scores="scores" :item="item" player="player0" ></Entry>
      </template>
      <template v-slot:item.player1="{item}">
        <Entry :scores="scores" :item="item" player="player1" ></Entry>
      </template>
      <template v-slot:item.player2="{item}">
        <Entry :scores="scores" :item="item" player="player2" ></Entry>
      </template>
      <template v-slot:item.player3="{item}">
        <Entry :scores="scores" :item="item" player="player3" ></Entry>
      </template>
    </v-data-table>
    <v-bottom-navigation
        app
        fixed
        grow
        hide-on-scroll
        color="primary">
      Version 2.0
    </v-bottom-navigation>
    <div class="text-right">
      <v-btn color="red darken-2" text dark @click="reset">
        Reset
      </v-btn>
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
            <v-text-field v-model="players[0]"></v-text-field>
            <v-text-field v-model="players[1]"></v-text-field>
            <v-text-field v-model="players[2]"></v-text-field>
            <v-text-field v-model="players[3]"></v-text-field>
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
import {Component, Vue, Watch} from 'vue-property-decorator';
import Entry from '@/components/Entry.vue';
import {Record} from '@/record'

@Component({
  components: {
    Entry
  }
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

  @Watch('players')
  setPlayers() {
    console.log('saving players')
    this.headers[1].text = this.players[0]
    this.headers[2].text = this.players[1]
    this.headers[3].text = this.players[2]
    this.headers[4].text = this.players[3]
    this.$store.dispatch('save', {scores: this.scores, players: this.players})
  }

  @Watch('scores')
  setScore() {
    console.log('saving score')
    this.$store.dispatch('save', {scores: this.scores, players: this.players})
  }

  mounted() {
    this.$store.dispatch('getState').then( (data: any) => {
      console.log('retrieved data')
      console.dir(data)
      this.scores = data.scores
      this.players = data.players

      if(this.scores?.length==0) {
        this.scores = [
          {valid: 'total', player0: 0, player1: 0, player2: 0, player3: 0},
          {valid: 'new', player0: 0, player1: 0, player2: 0, player3: 0}
        ];
      }
    })
  }

  validate(item: Record): { color: string; icon: string } {
    const sum = (+item.player0) + (+item.player1) + (+item.player2) + (+item.player3);
    if(sum === 36 ) {
      return {color: 'green', icon:'mdi-plus-circle'}
    } else {
      return {color: 'red', icon:'mdi-contrast-circle'}
    }
  }

  reset() {
    this.scores = [
      {valid: 'total', player0: 0, player1: 0, player2: 0, player3: 0},
      {valid: 'new', player0: 0, player1: 0, player2: 0, player3: 0}
    ];
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
    } else {
      this.error = 'Values must add up to 36, currently '+sum
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
table.v-datatable thead th {
  font-size: 20px !important;
}
</style>
