<template>
  <div class="video-layer" v-show="state">
    <div class="video-box">
      <iframe class="iframe" width="100%" height="100%" :src="videoLink"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
      </iframe>
    </div>

    <div class="close" @click.stop="close">×</div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "cvideo",
    data() {
      return {
        currentIndex: 0
      }
    },
    props: {
      videoLink: String,
      state: false
    },
    methods: {
      close() {
        this.$emit('closeVideo');
      },
    },
    computed: {},
    components: {},
    created() {

    },
    watch: {},
  }
</script>

<style lang="scss" type="text/scss">
  .video-layer {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    .video-box{
      width: 80%;
      height: 80%;
      margin: 0 auto;
      margin-top: 8%;
    }
    .close{
      position: absolute;
      right: 15px;
      top: 15px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      text-align: center;
      line-height: 50px;
      background: #fff;
      font-size: 50px;
      font-weight: bold;
    }
  }
</style>
