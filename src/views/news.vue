<template>
  <section class="news">
    <div class="header-fixed">
      <ul class="tag-list">
        <li v-for="(item,index) in tag.list" :class="tag.selectIndex==index?'select':''" @click.stop="tagTap(index)">
          {{item.text}}
        </li>
      </ul>
      <router-link class="image" to="/">
        <img src="http://rnbtcg.com/images/static/web/home/logo.png" alt="">
      </router-link>
    </div>

    <div class="content-box">
      <ul class="child-tag-container" v-if="tag.list[tag.selectIndex].children.length>0">
        <li v-for="(item,index) in tag.list[tag.selectIndex].children"
            :class="tag.list[tag.selectIndex].childIndex==index?'select':''" @click.stop="childTagTap(index)"
            :key="index">
          {{item.text}}
        </li>
      </ul>

      <div class="top-articles">
        <div class="new-title" @click.stop="topSwitchTap">
          <span>{{$t('message.news.top')}}</span>
          <i class="icon" :class="topCollapse?'rotate':''">
            <svg-icon icon-class="daosanjiao"></svg-icon>
          </i>
        </div>
        <ul class="top-list" :class="topCollapse?'collapse':''">
          <router-link :to="`article${item.id}`" tag="li" v-for="(item,index) in topArticles" :key="index">
            {{item.title}}
          </router-link>
        </ul>
      </div>

      <div class="tag-articles">
        <h3 class="new-title">{{$t('message.news.article')}}</h3>
        <ul class="article-list">
          <li class="item-article" v-for="(item,index) in tagArticles" :key="index" @click.stop="linkTap(index)">
            <div class="time">
              <span>{{item.author}}</span>
              <span>{{item.dateTime}}</span>
            </div>
            <div class="image">
              <img :src="item.picture" alt="">
              <i class="video-play" v-if="item.video" @click.stop="playVideoTap(item.video)">
                <svg-icon icon-class="play"></svg-icon>
              </i>
            </div>
            <h4 class="title">{{item.title}}</h4>
            <div class="zan">
              <div class="zan-num">
                <svg-icon icon-class="zan" class-name="icon"></svg-icon>
                <span>{{item.likeNum}}</span>
              </div>

              <div class="look-num">
                <svg-icon icon-class="eyes" class-name="icon"></svg-icon>
                <span>{{item.readNum}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="company-logo" v-if="!hasMore">
        <img src="http://rnbtcg.com/images/static/web/footer/logo.png" alt="">
      </div>
    </div>

    <c-video :video-link="video.link" :state="video.state" @closeVideo="closeVideo"></c-video>

  </section>
</template>

<script type="text/ecmascript-6">
  import util from '@common/util';
  import video from '@components/Video'

  export default {
    name: "news",
    data() {
      return {
        tag: {
          selectIndex: 0,
          list: [
            {
              id: this.$i18n.locale === 'en' ? '40,41,52,42' : '140,141,152,142',
              text: this.$t('message.tags.allArticle'),
              children: []
            }, {
              id: this.$i18n.locale === 'en' ? 40 : 140,
              text: this.$t('message.tags.anouncement'),
              children: []
            }, {
              id: this.$i18n.locale === 'en' ? 41 : 141,
              text: this.$t('message.tags.gameIntro'),
              children: []
            }, {
              id: this.$i18n.locale === 'en' ? 52 : 152,
              text: this.$t('message.tags.cardAndDeck'),
              childIndex: 0,
              children: [
                {
                  id: this.$i18n.locale === 'en' ? 52 : 152,
                  text: this.$t('message.tags.cardIntro'),
                },
                {
                  id: this.$i18n.locale === 'en' ? 53 : 153,
                  text: this.$t('message.tags.fire'),
                },
                {
                  id: this.$i18n.locale === 'en' ? 54 : 154,
                  text: this.$t('message.tags.water'),
                },
                {
                  id: this.$i18n.locale === 'en' ? 55 : 155,
                  text: this.$t('message.tags.wind'),
                },
                {
                  id: this.$i18n.locale === 'en' ? 56 : 156,
                  text: this.$t('message.tags.earth'),
                }
              ]
            }, {
              id: this.$i18n.locale === 'en' ? 42 : 142,
              text: this.$t('message.tags.faq'),
              children: []
            }
          ],
        },
        query: { //查询条件
          labels: '',
          page: 0,
          size: 6,
        },
        topArticles: [],//置顶文章
        topCollapse: false,//置顶文章是否收起
        tagArticles: [],//标签文章
        loading: false, //是否滚动标志位
        hasMore: true,//是否滚动标志位 结合使用
        video: {
          link: '',
          state: false
        }
      }
    },
    props: {
      tagid: String
    },
    methods: {
      //设置选中的标签
      setTagActiveIndex() {
        this.tag.list.filter((item, index) => {
          if (item.id == this.tagid) {
            this.tag.selectIndex = index;
            return true
          }
        })
      },

      //标签切换
      tagTap(index) {
        if (this.tag.selectIndex == index) {
          return false;
        }
        this.tag.selectIndex = index;
        //判断有没有子标签，如果有，默认选中第一个
        if (this.tag.list[this.tag.selectIndex].children.length > 0) {
          this.tag.list[this.tag.selectIndex].childIndex = 0;
        }
        this.query.labels = this.tag.list[this.tag.selectIndex].id;
        this.getArticleData(0);
      },

      //子标签切换
      childTagTap(index) {
        let children;
        if (this.tag.list[this.tag.selectIndex].childIndex == index) {
          return false;
        }
        this.tag.list[this.tag.selectIndex].childIndex = index;
        children = this.tag.list[this.tag.selectIndex].children;
        this.query.labels = children[index].id;
        this.getArticleData(0);
      },

      //获取置顶文章
      getTopArticleData() {
        let params = {};
        params.labels = this.$i18n.locale === 'en' ? '30' : 130;
        params.page = 0;
        params.size = 100;
        this.$axios.getArticleList(params)
          .then((response) => {
            if (response.code !== 200) {
              return false;
            }
            this.dealWithArticle(this.topArticles, response.data);
          })
          .catch((error) => {

          });
      },

      //获取文章数据
      getArticleData(type) {
        if (!type) {
          this.query.page = type;
          this.loading = false;
          this.hasMore = true;
          window.scroll(0, 0); //返回顶部
        }
        else {
          this.query.page += 1;
          this.loading = true;
        }
        this.$axios.getArticleList(this.query)
          .then((response) => {
            this.loading = false;
            if (response.code !== 200) {
              return false;
            }
            !type ? this.tagArticles = [] : null; //如果是切换标签则清空数组
            this.dealWithArticle(this.tagArticles, response.data);
            if (response.data.list.length < this.query.size)
              this.hasMore = false;
          })
          .catch((error) => {

          });
      },

      //处理文章数据
      dealWithArticle(array, data) {
        let list;
        list = data.list;
        for (let item of list) {
          array.push({
            id: item.id,
            title: item.title,
            picture: item.picture,
            simpleContent: item.simpleContent,
            author: item.author,
            readNum: item.readNum,
            likeNum: item.likeNum,
            dateTime: util.formatDate(item.createTime, 'yyyy.MM.dd'),
            video: item.video,
          });
        }
      },

      //置顶文章展开收起
      topSwitchTap() {
        this.topCollapse = !this.topCollapse;
      },

      //跳转
      linkTap(index) {
        let articleId;
        articleId = this.tagArticles[index].id;
        this.$router.push({path: `/article${articleId}`});
      },

      //播放视频
      playVideoTap(url) {
        this.video.link = url;
        this.video.state = true;
      },

      //关闭视频
      closeVideo() {
        this.video.link = '';
        this.video.state = false;
      }
    },
    computed: {},
    components: {
      'c-video': video,
    },
    created() {

    },
    mounted() {
      this.setTagActiveIndex();
      this.getTopArticleData();
      this.query.labels = this.tagid;
      this.getArticleData(0);

      window.onscroll = () => {
        if (!this.hasMore || this.loading)
          return;
        // 距离底部200px时加载一次
        let bottomOfWindow = document.documentElement.scrollHeight - (document.documentElement.scrollTop + document.body.scrollTop + window.innerHeight);

        if (bottomOfWindow < 200) {
          this.getArticleData(1);
        }
      };
    },
    beforeDestroy() {
      window.onscroll = null;
    },
  }
</script>

<style lang="scss" type="text/scss">
  .news {
    width: 100%;
    min-height: 750px;
    padding: 70px 0;
    background: rgba(0, 0, 0, .3);
    &::before {
      content: "";
      background-image: url("http://rnbtcg.com/images/static/web/home/1.png");
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: inherit;
      background-size: cover;
      z-index: -1;
    }
    .new-title {
      color: $--font-title-color;
      font-size: $--font-title-size;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .header-fixed {
      position: fixed;
      z-index: 1;
      top: 0;
      left: 0;
      width: 100%;
      height: 70px;
      background: #000000;
      padding: 0 40px;
      color: $--font-text-color;
      font-size: $--font-text-size;
      .tag-list {
        display: flex;
        height: inherit;
        align-items: center;
        > li {
          margin-right: 48px;
          padding-bottom: 5px;
          transition: color .3s;
          &:last-of-type {
            margin: 0;
          }
        }
        .select {
          font-size: $--font-title-size;
          color: $--font-title-color;
          border-bottom: 2px solid #C2B79E;
          font-weight: bold;
        }
      }
      .image {
        position: absolute;
        right: 40px;
        top: 5px;
        width: 168px;
        height: 62px;
        @include image
      }
    }
    .content-box {
      width: 100%;
      height: auto;
      @include content-box;
      .child-tag-container {
        display: flex;
        font-size: $--font-text-size;
        color: $--font-text-color;
        margin: 30px 0 50px 0;
        > li {
          padding: 0 28px;
          height: 40px;
          line-height: 38px;
          background: rgba(190, 178, 152, 0.13);
          border: 1px solid #E1CC9F;
          border-radius: 35px;
          margin-right: 30px;
          transition: all .3s
        }
        .select {
          background: #BEB298;
          color: #5D5440;
        }
      }
      .top-articles {
        width: 100%;
        margin: 50px 0;
        .new-title {
          display: flex;
          > span {
            font-weight: bold;
          }
          .icon {
            color: $--font-title-color;
            font-size: $--font-title-size;
            margin-left: 20px;
            transition: transform 0.1s;
            &.rotate {
              transform: rotate(180deg);
            }
          }
        }
        .top-list {
          color: $--font-text-color;
          font-size: $--font-text-size;
          transition: transform .1s;
          transform-origin: top;
          &.collapse {
            transform: scaleY(0); // *squish
            height: 0;
          }
          > li {
            padding-bottom: 20px;
            border-bottom: 1px dashed $--font-text-color;
            margin-bottom: 20px;
            &:last-of-type {
              margin: 0;
            }
          }
        }
      }
      .tag-articles {
        width: 100%;
        position: relative;
        .article-list {
          color: $--font-text-color;
          font-size: 0;
          .item-article {
            font-size: $--font-text-size;
            display: inline-block;
            vertical-align: top;
            width: 388px;
            height: 482px;
            background: #1F1F1F;
            border-radius: 10px;
            margin: 0 42px 38px 0;
            &:nth-of-type(3n) {
              margin-right: 0;
            }
            .time {
              height: 85px;
              padding: 15px;
              > span {
                display: block;
                &:last-of-type {
                  margin-top: 10px;
                }
              }
            }
            .image {
              position: relative;
              height: 295px;
              overflow: hidden;
              > img {
                width: 100%;
              }
              .video-play {
                position: absolute;
                top: 50%;
                left: 50%;
                margin: -30px 0 0 -30px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #dedee1;
                line-height: 60px;
                font-size: 30px;
                padding-left: 18px;
              }
            }
            .title {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin: 15px 0;
              padding: 0 15px;
            }
            .zan {
              padding: 0 15px;
              height: 30px;
              line-height: 30px;
              > div {
                float: right;
                &:first-of-type {
                  float: left;
                }
              }
              .icon {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .company-logo {
        width: 223px;
        height: 60px;
        margin: 0 auto;
        > img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
