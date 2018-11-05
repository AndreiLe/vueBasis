<template>

  <v-dialog width="400px" v-model="modal">
    <v-btn class="primary" flat slot="activator">Buy</v-btn>

    <v-card>
      <v-container>
        <v-layout>
          <v-flex xs12 row>
            <v-card-title>
              <h1 class="text--primary" v-text="this.ad.title"></h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12 row>
            <v-card-text>
              <v-text-field name="name" label="Name" type="text" v-model="name" :disabled="localLoading"></v-text-field>
              <v-text-field name="phone" label="Phone" type="text" v-model="phone" :disabled="localLoading"></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout>
          <v-flex xs12 row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="onCancel" :disabled="localLoading">Cansel</v-btn>
              <v-btn flat class="success" @click="onSave" :loading="localLoading">Buy it!</v-btn>
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
      name: '',
      phone: '',
      localLoading: false
    }
  },
  methods: {
    onCancel () {
      this.editedDescription = this.ad.description
      this.name = ''
      this.phone = ''
      this.modal = false
    },
    onSave () {
      if (this.name !== '' && this.phone !== '') {
        this.localLoading = true
        this.$store.dispatch('createOrder', {
          name: this.name,
          phone: this.phone,
          adId: this.ad.id
        })
          .finally(() => {
            this.name = ''
            this.phone = ''
            this.localLoading = false
            this.modal = false
          })
      }
    }
  }
}
</script>
