<template>
	<header class="mall-header">
		<div class="back-btn" @click="goBack">
			<i class="back-icon">
				< 
			</i>
		</div>
		<div class="title">
			<span>商城页面</span>
		</div>
		<div class="chat-icon">
			<i class="iconfont icon-liaotian"></i>
		</div>
	</header>
    <div class="mall-content">商城</div>
	<Tabbar></Tabbar>
</template>

<script setup>
	import Tabbar from '@/components/common/Tabbar.vue'
	import {useRouter} from 'vue-router'
	let router = useRouter()
	const goBack = ()=>{
		router.push('/home') 
	}
</script>

<style scoped>
/* 头部样式 */
.mall-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 16px;
  background-color: #ff5777;
  box-shadow: 0 1px 8px rgba(255, 244, 244, 0.08);
  position: relative;
  z-index: 99;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.back-btn:hover {
  background-color: #ffffff;
}

.back-icon {
  font-size: 20px;
  color: #ffffff;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.chat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.chat-icon:hover {
  background-color: #ffffff;
}

.chat-icon .iconfont {
  font-size: 20px;
  color: #ffffff; /* 电商常用活力红色，可替换为品牌色 */
}

/* 商城内容区域 */
.mall-content {
  height: calc(100vh - 46px - 50px); /* 减去头部和Tabbar高度，实现页面撑满 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #666;
  background-color: #f9f9f9;
}
</style>