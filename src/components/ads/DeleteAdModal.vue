<template>
  <v-dialog width="400px" v-model="modal">
    <v-list-tile :key="'Delete'" @click="" slot="activator">
      <v-list-tile-title>Delete</v-list-tile-title>
    </v-list-tile>
    <v-card>
      <v-container>
        <v-layout>
          <v-flex xs12 row>
            <v-card-title>
              <h1 class="text--primary" v-text="this.ad.title"></h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout>
          <v-flex xs12 row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="onCancel" :disabled="localLoading">Cansel</v-btn>
              <v-btn flat class="error" @click="onDelete" :loading="localLoading">Delete it!</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default{
  props: ['ad'],
  data () {
    return {
      modal: false,
      localLoading: false
    }
  },
  methods: {
    onCancel () {
      this.modal = false
    },
    onDelete () {
      this.localLoading = true
      this.$store.dispatch('deleteAd', {
        adId: this.ad.id
      })
        .finally(() => {
          this.localLoading = false
          this.modal = false
          this.$router.push('/list')
        })
    }
  }
}
</script>
