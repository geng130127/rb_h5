<template>
  <section class="home">

    <div class="header">
      <h1>{{$t('message.home.home')}}</h1>
      <router-link class="image" to="/">
        <img src="http://rnbtcg.com/images/static/web/home/logo.png" alt="">
      </router-link>
    </div>

    <div class="content-box">

      <div class="left">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <router-link :to="`article${item.id}`" class="swiper-slide" v-for="(item,index) in swiperList"
                         :key="index">
              <img class="image" :src="item.picture" alt="">
              <div class="description">
                <h3>{{item.title}}</h3>
                <p>{{item.simpleContent}}</p>
              </div>
            </router-link>
          </div>
          <div class="swiper-pagination"></div>
        </div>

        <div class="top-article">
          <router-link tag="div" :to="`article${topArticle.id}`" class="article-title">
            {{topArticle.title}}
          </router-link>
        </div>
      </div>

      <div class="right">
        <router-link :to="item.url" class="tag" v-for="(item,index) in tags" :key="index"
                     :style="{backgroundImage:`url('${item.back}')`}">
          <i>
            <svg-icon :icon-class="item.icon" class-name="icon"></svg-icon>
          </i>
          <span>{{item.text}}</span>
        </router-link>
      </div>

    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import 'swiper/dist/css/swiper.min.css'
  import swiper from 'swiper'
  import util from '@common/util'

  export default {
    name: "home",
    data() {
      return {
        swiperList: [],
        topArticle: {},
        tags: [
          {
            id: this.$i18n.locale === 'en' ? 40 : 140,
            text: this.$t('message.tags.anouncement'),
            back: 'http://rnbtcg.com/images/static/h5/tag/anouncement.png',
            icon: 'broadcast',
            url: `news?tagid=${this.$i18n.locale === 'en' ? 40 : 140}`
          }, {
            id: this.$i18n.locale === 'en' ? 41 : 141,
            text: this.$t('message.tags.gameIntro'),
            back: 'http://rnbtcg.com/images/static/h5/tag/gameIntro.png',
            icon: 'bulb',
            url: `news?tagid=${this.$i18n.locale === 'en' ? 41 : 141}`
          }, {
            id: this.$i18n.locale === 'en' ? 52 : 152,
            text: this.$t('message.tags.cardAndDeck'),
            back: 'http://rnbtcg.com/images/static/h5/tag/cardsdecks.png',
            icon: 'cardpackage',
            url: `news?tagid=${this.$i18n.locale === 'en' ? 52 : 152}`
          }, {
            id: this.$i18n.locale === 'en' ? 42 : 142,
            text: this.$t('message.tags.faq'),
            back: 'http://rnbtcg.com/images/static/h5/tag/faq.png',
            icon: 'question',
            url: `news?tagid=${this.$i18n.locale === 'en' ? 42 : 142}`
          }
        ],
      }
    },
    props: {
      id: String//用戶ID
    },
    methods: {
      getSwiperData() {
        let params = {};
        params.labels = this.$i18n.locale === 'en' ? 31 : 131;
        params.page = 0;
        params.size = 4;
        this.$axios.getArticleList(params)
          .then((response) => {
            if (response.code !== 200) {
              return false;
            }
            this.loadSwiper(response.data);
          })
          .catch((error) => {

          });

        //設置COOKIE
        this.id ? util.setCookie('user_id', this.id) : null;
      },
      getTopData() {
        let params = {};
        params.labels = this.$i18n.locale === 'en' ? 32 : 132;
        params.page = 0;
        params.size = 1;
        this.$axios.getArticleList(params)
          .then((response) => {
            if (response.code !== 200) {
              return false;
            }
            this.topArticle = {
              id: response.data.list[0].id,
              title: response.data.list[0].title,
            };
          })
          .catch((error) => {

          })
      },

      loadSwiper(data) {
        let list;
        list = data.list;
        for (let item of list) {
          this.swiperList.push({
            id: item.id,
            title: item.title,
            picture: item.picture,
            simpleContent: item.simpleContent
          });
        }
        if (this.swiperList.length === 1) {
          return false;
        }
        this.$nextTick(() => {
          new swiper('.swiper-container', {
            speed: 1000,
            loop: true,
            autoplay: {
              delay: 3000,
              stopOnLastSlide: false,
              disableOnInteraction: false,
            },
            pagination: {
              el: '.swiper-pagination',
            },
          })
        })
      },
    },
    computed: {},
    components: {},
    created() {

    },
    mounted() {
      this.getSwiperData();
      this.getTopData();
    },
  }
</script>

<style lang="scss" type="text/scss">
  .home {
    width: 100%;
    min-height: 750px;
    background-image: url("http://rnbtcg.com/images/static/web/home/1.png");
    background-size: cover;
    .header {
      position: relative;
      width: 100%;
      height: 60px;
      background: #1f242b;
      padding: 0 40px;
      color: $--font-title-color;
      font-size: $--font-title-size;
      > h1 {
        height: 100%;
        line-height: 70px;
        font-weight: bold;
      }
      .image {
        position: absolute;
        right: 40px;
        top: 10px;
        width: 150px;
        height: 55px;
        @include image
      }
    }
    .content-box {
      width: 100%;
      height: auto;
      @include content-box;
      padding-top: 13px;
      min-height: 575px;
      display: flex;
      .left {
        width: 620px;
        margin-right: 46px;
        .swiper-wrapper {
          width: 100%;
          height: 472px;
          .swiper-slide {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 12px;
            display: block;
            &::before {
              position: absolute;
              content: '';
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0.00) 0%, #000000 100%);
            }
            .image {
              width: 100%;
              height: auto;
            }
            .description {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              width: 100%;
              height: 100%;
              padding: 200px 20px 40px 20px;

              > h3 {
                font-size: $--font-title-size;
                color: $--font-title-color;
                line-height: 1.5;
                font-weight: bold;
              }
              > p {
                font-size: $--font-text-size;
                color: $--font-text-color;
                line-height: 1.5;
                font-weight: bold;
              }
            }
          }

        }
        .swiper-pagination {
          right: 15px;
          width: auto;
          left: auto;
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1px solid #C0B6A3;
            &.swiper-pagination-bullet-active {
              background: #C0B6A3;
            }
          }
        }
        .top-article {
          position: relative;
          width: 100%;
          height: 85px;
          margin-top: 20px;
          border-radius: 12px;
          overflow: hidden;
          background-image: url('http://rnbtcg.com/images/static/h5/recommend.png');
          background-size: cover;
          .article-title {
            width: 100%;
            height: 100%;
            background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.68) 79%);
            font-size: $--font-title-size;
            color: $--font-title-color;
            padding: 10px 20px;
            font-weight: bold;
            line-height: 1.2;
          }
        }
      }
      .right {
        width: 575px;
        position: relative;
        .tag {
          width: 100%;
          height: 130px;
          background-size: cover;
          font-size: 40px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          padding-left: 40px;
          > span {
            font-weight: bold;
          }
          > i {
            width: 50px;
            margin-right: 30px;
            .icon {
              width: 50px;
              height: 50px;
            }
          }
          &:nth-of-type(1) {
            color: #887144;
          }
          &:nth-of-type(2) {
            color: #13516E;

          }
          &:nth-of-type(3) {
            color: #693C1C;
          }
          &:nth-of-type(4) {
            color: #295C22;
            margin: 0;
          }
        }
      }
    }
  }
</style>
