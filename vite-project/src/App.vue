<template>
	<router-view v-slot="{Component,route}">
		<keep-alive v-if="!route.meta.keepAlive">
			<component :is="Component"></component>
		</keep-alive>
		<component :is="Component" v-else></component>
	</router-view>
  </template>
  
  <script setup>
	  import { onMounted } from 'vue';
	  import { useUserStore } from '@/store/store.js'
	  const userStore = useUserStore()
	  onMounted(()=>{
		  userStore.initUser()
	  })
  </script>
  
  <style>
  </style>
  