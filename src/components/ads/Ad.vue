<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="!loading">
          <v-menu v-if="isMyAd" bottom left style="position: absolute; right: 0; z-index: 1;">
            <v-btn icon slot="activator" flat>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <app-delete-modal :ad="ad" ></app-delete-modal>
            </v-list>
          </v-menu>
          <v-img max-height="50vh" contain :src="ad.imageSrc"></v-img>
          <v-card-text>
            <h1 class="text--primary">{{ad.title}}</h1>
            <p>{{ad.description}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <addEditAdModal v-if="isMyAd" :ad="ad"></addEditAdModal>
            <app-buy-modal v-if="isUserLoggedIn" :ad="ad"></app-buy-modal>
          </v-card-actions>
        </v-card>
        <div v-else class="text-xs-center">
          <v-progress-circular indeterminate :size="70" :width="7"></v-progress-circular>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditAdModal from './EditAdModal'

export default {
  props: ['id'],
  computed: {
    ad () {
      const id = this.id
      const result = this.$store.getters.adById(id)
      return result
    },
    loading () {
      this.$store.getters.loading
    },
    isMyAd () {
      const id = this.id
      const result = this.$store.getters.isMyAdById(id)
      return result
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    }
  },
  components: {
    addEditAdModal: EditAdModal
  }
}
</script>
