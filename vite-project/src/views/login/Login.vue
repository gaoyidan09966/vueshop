<template>
	<div class="login">
		<Header></Header>
		<section>
			<div class="login-tel">
				<input type="text" v-model="userTel" placeholder="输入手机号" pattern="[0-9]*" />
			</div>
			<div class="login-pwd">
				<input type="password" v-model="userPwd" placeholder="输入密码" />
			</div>
			<div class="login-btn" @click="login">登录</div>
			<div class="tab">
				<span @click="goModify">修改密码</span>
				<span @click="goRegister">快速注册</span>
			</div>
		</section>
	</div>
</template>

<script setup>
	import Header from './Header.vue';
	import { ref } from 'vue'
	
	const userTel = ref('')
	const userPwd = ref('')
	
	const rules = {
		userTel:{
			rule:/^1[23456789]\d{9}$/,
			msg:'手机输入内容错误，请重新输入'
		},
		userPwd:{
			rule:/^\w{6,12}$/,
			msg:'密码输入内容错误，请重新输入'
		}
	}
	
	import { showToast } from 'vant'
	
	//验证规则
	const validate = (key) =>{
		let bool = true
		const value = key === 'userTel' ? userTel.value : userPwd.value
		if( !rules[key].rule.test(value) ){
			showToast(rules[key].msg)
			bool = false
			return false
		}
		return bool
	}
	
	import http from '@/common/api/request.js'
	import { useUserStore } from '../../store/store.js'
	const userStore = useUserStore()
	const login = ()=>{
		//验证
		if( !validate('userTel') ) return
		if( !validate('userPwd') ) return
		http.$axios({
			url:'/api/login',
			method:'POST',
			data:{
				userTel:userTel.value,
				userPwd:userPwd.value
			}
		}).then(res => {
			console.log( '登录信息',res )
			showToast(res.msg)
			//跳转页面/保存用户信息
			//如果登录失败
			if( !res.success) return
			userStore.userLogin(res.data)
			router.push('/home')
		})
	}
	
	import { useRouter } from 'vue-router';
	let router = useRouter()
	//跳转注册页面
	const goRegister = ()=>{
		router.push({path:'/register'})
	}
	
	const goModify = ()=>{
		router.push({path:'/modify'})
	}
</script>

<style scoped>
/* 整个页面铺满屏幕 */
.login {
	width: 100vw;
	height: 100vh;
	background: linear-gradient(180deg, #ffeff3 0%, #ffdfe8 100%);
	display: flex;
	flex-direction: column;
}

/* Header固定在顶部 */
.login > Header {
	flex-shrink: 0;
}

/* 主体内容：让 section 居中显示 */
section {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 1rem;
	box-sizing: border-box;
}

/* 输入区域整体 */
section > div {
	width: 100%;
	max-width: 500px;
	margin: 0.4rem 0;
}

/* 输入框样式 */
section input {
	width: 100%;
	height: 1.2rem;
	box-sizing: border-box;
	padding: 0 0.4rem;
	border: none;
	border-radius: 10px;
	background-color: #ffffff;
	font-size: 0.4rem;
	color: #333;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

/* 输入框聚焦效果 */
section input:focus {
	outline: none;
	box-shadow: 0 0 0 2px rgba(255, 87, 119, 0.2);
}

/* 登录按钮 */
section .login-btn {
	width: 100%;
	height: 1.2rem;
	line-height: 1.2rem;
	color: #fff;
	text-align: center;
	font-size: 0.45rem;
	font-weight: 500;
	background: linear-gradient(135deg, #ff6685 0%, #ff8faa 100%);
	border-radius: 10px;
	box-shadow: 0 6px 15px rgba(255, 87, 119, 0.3);
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	margin-top: 0.8rem;
}

/* 点击按钮轻微缩放 */
section .login-btn:active {
	transform: scale(0.97);
	box-shadow: 0 3px 10px rgba(255, 87, 119, 0.25);
}

/* “修改密码 / 快速注册” */
section .tab {
	display: flex;
	justify-content: space-between;
	width: 100%;
	max-width: 500px;
	margin-top: 0.8rem;
	font-size: 0.36rem;
	color: #666;
}

section .tab span {
	cursor: pointer;
	transition: color 0.3s;
}

section .tab span:hover {
	color: #ff5777;
}
</style>
