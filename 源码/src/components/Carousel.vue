<template>
   <div class="content">
     <div class="box"   @mouseover="pasue" @mouseout="autoPlay">
       <ul class="list" :style="ulX" :class="{'transit': notransit}">
              <li v-for="(item, index) in imglist" :key="index" >
                  <img :src="item">
              </li>
          </ul>
     </div>
          <!-- 左右按钮 -->
          <div class="arrow">

              <img :src="left" class="left" @click="prev" @mouseover="pasue" @mouseout="autoPlay">
              <img :src="right" class="right" @click="next" @mouseover="pasue" @mouseout="autoPlay">
          </div>
          <!-- 分页器 -->
          <div class="pagnator">
              <span v-for="(page, index) in imglist" :key="index" :class="{'active': index == current + 1,'extra': index == 0 || index == imglist.length -1}"></span>
          </div>
          <div class="status">
            状态：{{status}}
          </div>
      </div>

</template>

<script>
import pic01 from '@/assets/01.jpg'
import pic02 from '@/assets/02.jpg'
import pic03 from '@/assets/03.jpg'
import pic04 from '@/assets/04.jpg'
import pic05 from '@/assets/05.jpg'
import picl from '@/assets/left.png'
export default {
  name: 'Carousel',
  data () {
    return {

      imglist: [
        pic05,
        pic01,
        pic02,
        pic03,
        pic04,
        pic05,
        pic01

      ],
      left: picl,
      right: picl,
      move: {
        width: '0',
        transform: 'translateX(0)'
      },
      current: 0,
      notransit: true,
      status: ''
    }
  },
  computed: {
    ulX () {
      this.move = {// current每次变化都执行一次
        transform: 'translateX(-' + ((this.current + 1) * 100) + '%)'
      }
      return this.move
    }

  },
  methods: {
    prev () {
      this.current--
      if (this.current == -1) {
        setTimeout(() => {
          this.notransit = false

          this.current = this.imglist.length - 3
          // console.log(this.list.length)
        }, 500)
      }
      this.notransit = true
    },
    next () {
      this.current++
      console.log(this.imglist.length)
      if (this.current == this.imglist.length - 2) {
        setTimeout(() => {
          this.notransit = false
          this.current = 0
        }, 500)
      }
      this.notransit = true
    },
    pasue () { // 暂停
      clearInterval(this.timer)
      this.status = '暂停'
    },

    autoPlay () { // 自动播放
      this.timer = setInterval(() => {
        this.next()
      }, 2000)
      this.status = '播放中'
    }
  },
  created () {
    this.autoPlay()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

   .content{

       position: relative;
      width: 100%;

       margin-top: 100px;
   }
   .box{
     width: 60%;
     border: 5px solid yellow;
      margin: 0 auto;
     height: 400px;
    overflow: hidden;
   }

   .transit {
       transition: all 0.5s;
   }
   .list{

     white-space: nowrap;
     height: 100%;
      width: 100%;
   }
   .list li {
       height: 100%;
        width: 100%;
        display: inline-block;

   }
   .list img {
       width: 100%;
      height: 100%;
   }
   .arrow img {
       position: absolute;
       top: 46%;
       transform: translateY(-50%);
       padding: 6px 0;
       cursor: pointer;
   }

   .arrow .left {
     left: 10%;
     width: 5%;
   }
   .arrow .right {
       right: 10%;
       width: 5%;
       transform: rotateY(180deg) translateY(-50%);
   }
   .pagnator {
       position: absolute;
       bottom: -40px;
       left: 0;
       right: 0;
   }
   .status{
     position: absolute;
     left: 0;
     right: 0;
     top: -50px;
     color: antiquewhite;
   }
   .pagnator span {
       display: inline-block;
       width: 15px;
       height: 15px;
       margin: 4px;
       border-radius: 50%;
       background: #888;
       /* cursor: pointer; */
   }
   .active {
       background: yellow !important;
   }
   .extra {
       display: none !important;
   }
</style>
