<template>
	<div class="payment-page">
	  <div class="success-container">
		<div class="checkmark">✓</div>
		<h1 class="title">您已经支付完成</h1>
		<p class="message">感谢您的支付，订单已成功处理！</p>
	  </div>
	</div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .payment-page {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
	font-family: 'Segoe UI', system-ui, sans-serif;
	padding: 20px;
	box-sizing: border-box;
  }
  
  .success-container {
	text-align: center;
	background: white;
	padding: 40px 30px;
	border-radius: 16px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
	max-width: 500px;
	width: 100%;
  }
  
  .checkmark {
	width: 60px;
	height: 60px;
	background-color: #27ae60;
	color: white;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 32px;
	margin: 0 auto 24px;
	box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  }
  
  .title {
	font-size: 24px;
	font-weight: 700;
	color: #2c3e50;
	margin-bottom: 12px;
  }
  
  .message {
	font-size: 16px;
	color: #7f8c8d;
	line-height: 1.5;
  }
  </style>