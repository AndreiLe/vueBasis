<template>
  <div v-if="!loading">
    <v-container fluid>
      <v-layout row>
        <v-flex xs12>
          <v-carousel>
            <v-carousel-item v-for="item in promoAds" :src="item.imageSrc" :key="item.key">
              <div class="car-link">
                <v-btn class="error" :to="'/ad/' + item.id">{{item.title}}</v-btn>
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4  v-for="item in ads" :src="item.imageSrc" :key="item.key">
          <v-card :key="item.key">
            <v-img :src="item.imageSrc" height="200px"></v-img>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{item.title}}
                <div>{{item.description}}</div>
              </h3>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :to="'/ad/' + item.id">Open</v-btn>
            <app-buy-modal v-if="isUserLoggedIn" :ad="item"></app-buy-modal>
          </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  <div v-else class="loading-template">
    <v-container>
      <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate :size="70" :width="7" color="white"></v-progress-circular>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  computed: {
    promoAds () {
      return this.$store.getters.promoAds
    },
    ads () {
      return this.$store.getters.ads
    },
    loading () {
      return this.$store.getters.loading
    },
    isUserLoggedIn () {
      return this.$store.getters.isUserLoggedIn
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/home.scss';
  .car-link{
    position: absolute;
    bottom: 50px;
    left: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    transform: translate(-50%, 0);
    padding: 5px 15px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }
  .v-progress-circular{
    margin-top: 50vh;
    transform: translateY(-100%);
  }
</style>
