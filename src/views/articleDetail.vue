<template>
  <section class="article-detail">
    <div class="header">
      <h1>{{$t('message.articleDetail.article')}}</h1>
      <router-link class="image" to="/">
        <img src="http://rnbtcg.com/images/static/web/home/logo.png" alt="">
      </router-link>
    </div>
    <div class="article-area">
      <div class="article-title">
        <h3>{{article.title}}</h3>
      </div>
      <div class="article-time">
        <span>{{article.author}}</span>
        <span>{{article.createTime}}</span>
        <i>
          <svg-icon icon-class="eyes" class-name="icon"></svg-icon>
        </i>
        <span>{{article.readNum}}</span>
      </div>
      <div class="article-text" v-html="article.content"></div>
      <ul class="article-tags">
        <li class="speak">{{$t('message.articleDetail.tags')}}:&nbsp;</li>
        <li v-for="(item,index) in article.labelName" :key="index">
          {{item}},&nbsp;
        </li>
      </ul>
      <div class="article-like">

        <div v-if="!article.likeNum" class="praise-0" @click.stop="likeTap">
          <svg-icon class-name="icon-zan" icon-class="zan"></svg-icon>
        </div>

        <div v-else class="praise" :class="article.like?'active':''" @click.stop="likeTap">
          <svg-icon class-name="icon-zan" icon-class="zan"></svg-icon>
          <span>{{article.likeNum}}</span>
        </div>
      </div>
      <div class="article-code" v-if="article.code">
        <span ref="code">{{article.code}}</span>
        <button class="copy" @click.stop="copyCodeTap">{{$t('message.articleDetail.copyCpde')}}</button>
      </div>
      <div class="company-logo">
        <img src="http://rnbtcg.com/images/static/web/footer/logo.png" alt="">
      </div>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
  import util from '@common/util';

  export default {
    name: "articleDetail",
    data() {
      return {
        article: {
          title: '',
          content: '',
          createTime: '',
          author: '',
          labelName: [],
          code: '',
          readNum: 0,
          likeNum: 0,
          like: false
        }
      }
    },
    props: {
      id: String
    },
    methods: {
      getArticle() {
        let userId, param;
        userId = util.getCookie('user_id');
        param = {
          id: this.id,
          user_id: userId ? userId : 0
        };
        this.$axios.getArticleDetail(param)
          .then((response) => {
            if (response.code !== 200) {
              return false;
            }
            this.article = {
              title: response.data.title,
              content: response.data.content,
              createTime: util.formatDate(response.data.createTime, 'yyyy.MM.dd'),
              author: response.data.author,
              labelName: response.data.labelName,
              code: response.data.code,
              readNum: response.data.readNum,
              likeNum: response.data.likeNum,
              like: response.like
            }
          })
          .catch((error) => {

          })
      },

      //点赞或者取消点赞
      likeTap() {
        let userId;
        userId = util.getCookie('user_id');
        if (!userId) {
          return false;
        }
        this.article.like = !this.article.like;
        if (this.article.like) {
          this.article.likeNum += 1;
        }
        else {
          this.article.likeNum -= 1;
        }
        this.$axios.articleLike({user_id: userId, article_id: this.id})
          .then((response) => {
            if (response.code !== 200) {
              return false;
            }
          })
          .catch((error) => {

          })
      },

      //复制代码
      copyCodeTap() {
        var selection,range,referenceNode;
        referenceNode=this.$refs.code;
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(referenceNode);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
      },
    },
    computed: {},
    components: {},
    created() {

    },
    mounted() {
      this.getArticle();
    },
  }
</script>

<style lang="scss" type="text/scss">
  .article-detail {
    width: 100%;
    min-height: 750px;
    padding-bottom: 30px;
    background: rgba(0,0,0,.3);
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
    .header {
      position: relative;
      width: 100%;
      height: 60px;
      background: #1f242b;
      padding: 0 40px;
      color: $--font-title-color;
      font-size: $--font-title-size;
      margin-bottom: 40px;
      > h1 {
        height: 100%;
        line-height: 70px;
        font-weight: bold;
      }
      .image {
        position: absolute;
        right: 40px;
        top: 10px;
        width: 155px;
        height: 55px;
        @include image
      }
    }
    .article-area {
      width: 1110px;
      margin: 0 auto;
      .article-title {
        position: relative;
        min-height: 30px;
        font-size: 30px;
        line-height: 1.3;
        > h3 {
          text-align: center;
          color: #B8B2A2;
          font-weight: bold;
        }
      }
      .article-time {
        font-size: 20px;
        color: #bbb199;
        text-align: center;
        margin: 20px 0 40px 0;
        font-weight: bold;
        > span {
          line-height: 20px;
          margin-right: 20px;
          &:nth-of-type(2) {
            font-weight: bold;
          }
          &:last-of-type {
            margin-left: 20px;
          }
        }
      }
      .article-text {
        font-size: $--font-text-size;
        color: #AAAAAA;
        margin-top: 20px;
        p {
          margin-top: 20px;
          line-height: 1.7;
          color: #bbb199;
          font-size: $--font-text-size;
        }
        img {
          display: block;
          margin: 10px auto;
          max-width: 100%;
        }
        .fr-img-wrap > span { // 图片标题
          margin: auto;
          display: block;
          padding: 5px 5px 10px;
          font-size: 14px;
          font-weight: 400;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-opacity: .9;
          -moz-opacity: .9;
          opacity: .9;
          -ms-filter: "alpha(Opacity=0)";
          width: 100%;
          text-align: center;
        }
        video {
          display: block;
          margin: 10px auto;
          max-width: 100%;
        }
        blockquote {
          border-left: solid 2px #5e35b1;
          margin-left: 0;
          padding-left: 5px;
          color: #5e35b1;
        }
        a {
          color: #1A73E8;
          cursor: pointer;
        }
        a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
          display: none !important;
        }
        a[href="https://www.froala.com/wysiwyg-editor?pb=1"] {
          display: none !important;
          position: absolute;
          top: -99999999px;
        }
        p[data-f-id="pbf"] {
          display: none !important;
          position: absolute;
          top: -99999999px;
        }
      }
      .article-tags {
        display: flex;
        font-size: $--font-text-size;
        color: $--font-text-color;
        margin: 30px 0;
      }
      .article-like {
        position: relative;
        height: 70px;
        margin-bottom: 80px;
        .praise-0 {
          width: 70px;
          height: 70px;
          margin: 0 auto;
          border: 1px solid #9F9889;
          border-radius: 50%;
          line-height: 65px;
          text-align: center;
          .icon-zan {
            color: #9F9889;
            font-size: 40px;
          }

        }
        .praise {
          width: 150px;
          height: 70px;
          border: 1px solid #9F9889;
          border-radius: 35px;
          margin: 0 auto;
          line-height: 70px;
          color: $--font-text-color;
          text-align: center;
          &.active {
            background: rgba(236, 193, 101, 0.22);
            border: 1px solid #ECC165;
            color: #ECC165;
          }
          .icon-zan {
            font-size: 40px;
          }
          > span {
            margin-left: 10px;
            font-size: $--font-text-size
          }
        }
      }
      .article-code {
        position: relative;
        width: 100%;
        height: 70px;
        background: rgba(91, 91, 91, 0.41);
        border-radius: 37px;
        overflow: hidden;
        padding: 0 340px 0 40px;
        line-height: 70px;
        color: $--font-text-color;
        font-size: $--font-text-size;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom:50px;
        .copy{
          position: absolute;
          right: 0;
          top: 0;
          width: 320px;
          height: 100%;
          border: none;
          background: rgba(201,185,148,0.36);
          border-radius: 33px;
          color: #C2B79E;
          font-size: $--font-text-size;
          outline:none;
        }
      }
      .company-logo{
        width: 223px;
        height: 60px;
        margin: 0 auto;
        >img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
