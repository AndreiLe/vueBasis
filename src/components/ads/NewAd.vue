<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary md-3">Create new ad</h1>
        <v-form v-model="valid" ref="form" validation>
          <v-text-field class="mb-3" name="title" label="Ad title" type="text" v-model="title" required :rules="[v => !!v || 'Title is required']"></v-text-field>
          <v-text-field name="description" label="Ad description" type="text" v-model="description" required :rules="[v => !!v || 'Description is required']" multi-line></v-text-field>
        </v-form>
        <v-layout row class="mb-3">
          <v-flex xs12>
            <v-btn class="warning" @click="triggerUpload">
              Upload
              <v-icon right dark>cloud_upload</v-icon>
            </v-btn>
            <input type="file" style="display: none;" accept="image/*" ref="fileInput" @change="onFileChange">
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <img :src="imageSrc" v-if="imageSrc" alt="" style="max-width: 100%">
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-switch color="primary" label="Add to promo?" v-model="promo"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid || !image || loading" :loading="loading" class="success" @click="createAd" :loadign="loading">Create Ad</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      description: '',
      promo: '',
      valid: false,
      image: null,
      imageSrc: ''
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    createAd () {
      if (this.$refs.form.validate() && this.image) {
        const ad = {
          title: this.title,
          description: this.description,
          promo: this.promo,
          image: this.image
        }

        this.$store.dispatch('createAd', ad)
          .then(() => {
            this.$router.push('/list')
          })
          .catch(() => {

          })
      }
    },
    triggerUpload () {
      this.$refs.fileInput.click()
    },
    onFileChange (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imageSrc = reader.result
      }
      reader.readAsDataURL(file)
      this.image = file
    }
  }
}
</script>
