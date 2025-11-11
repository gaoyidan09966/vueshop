<template>
	<ul class="sorts">
		<li v-for="(item,index) in sortList" :key="item.id">
			<img :src="item.imgUrl" alt="" />
			<span>{{item.title}}</span>
		</li>
	</ul>
</template>

<script setup>
	// let sortList = [{
	// 		id: 1,
	// 		title: '女装',
	// 		imgUrl: './images/1.webp'
	// 	}, {
	// 		id: 2,
	// 		title: '女鞋',
	// 		imgUrl: './images/2.webp'
	// 	},
	// 	{
	// 		id: 3,
	// 		title: '上衣',
	// 		imgUrl: './images/3.webp'
	// 	},
	// 	{
	// 		id: 4,
	// 		title: '美妆/护肤',
	// 		imgUrl: './images/4.webp'
	// 	},
	// 	{
	// 		id: 5,
	// 		title: '裤子',
	// 		imgUrl: './images/5.webp'
	// 	},
	// 	{
	// 		id: 6,
	// 		title: '母婴/童装',
	// 		imgUrl: './images/6.webp'
	// 	},
	// 	{
	// 		id: 7,
	// 		title: '裙子',
	// 		imgUrl: './images/7.webp'
	// 	},
	// 	{
	// 		id: 8,
	// 		title: '男装男鞋',
	// 		imgUrl: './images/8.webp'
	// 	},
	// 	{
	// 		id: 9,
	// 		title: '套装',
	// 		imgUrl: './images/9.webp'
	// 	},
	// 	{
	// 		id: 10,
	// 		title: '配饰',
	// 		imgUrl: './images/10.webp'
	// 	}
	// ]
	import axios from 'axios'
	import {ref,onMounted} from 'vue'
	import http from '@/common/api/request.js'
	const sortList = ref([])
	onMounted(()=>{
		fetchData()
	})
	const fetchData = async () => {
		// const res = await axios.get('/api/index')
		let res = await http.$axios({url:'/api/index'})
		console.log(res)
		sortList.value = res.sortList
	}
</script>

<style scoped>
	.sorts {
		width: 100%;
		background-color: white;
		font-size: 0.35rem;
		box-sizing: border-box;
		display: flex;
		flex-flow: row wrap;
	}

	.sorts li {
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		flex: 0 0 20%;
		margin: 0.3rem 0;
	}

	.sorts li img {
		width: 1.5rem;
		height: 1.5rem;
	}

	.sorts li span {
		margin-top: 0.1875rem;
		color: rgb(102, 102, 102);
	}
</style>