<template>
	<div class="view login" v-if="state.username === '' || state.username === null">
		<form class="login-form" @submit.prevent="Login">
			<div class="form-inner">
				<h1>login to firechat</h1>
				<label for="username">Username:</label>
				<input type="text" v-model="inputUsername" placeholder="Enter Username"/>
				<input type="submit" value="login">
			</div>
		</form>
	</div>

	<div class="view chat" v-else>
		<header>
			<button class="logout" @click="Logout">Logout</button>
			<h1>Welcome {{state.username}}</h1>
		</header>
		<div class="chat-box">
			<div v-for="message in state.messages" :key="message.key" :class="(message.username === state.username ? 'message current-user' : 'message')">
				<div class="message-inner">
					<div class="username">{{message.username}}</div>
					<div class="content">{{message.content}}</div>
				</div>
			</div>
		</div>
		<footer>
			<form @submit.prevent="sendMessage">
				<input type="text" v-model="inputMessage" placeholder="Write Your Message...">
				<input type="submit" value="send">
			</form>
		</footer>
	</div>

</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import database from './database';

export default {
  setup() {
	const inputUsername = ref("");
	const inputMessage = ref("");

	const state = reactive({
		username: "",
		messages: []
	});

	const Login = () => {
		if (inputUsername.value != "" || inputUsername.value != null) {
			state.username = inputUsername.value;
			inputUsername.value = "";
		}
	}

	const Logout = () => {
		state.username = "";
	}

	const sendMessage = () => {
		const messagesRef = database.database().ref("messages");

		if (inputMessage.value === "" || inputMessage.value === null) {
			return;
		}

		const message = {
			username: state.username,
			content: inputMessage.value
		}

		messagesRef.push(message);
		inputMessage.value = '';
	}

	onMounted(() => {
		const messagesRef = database.database().ref("messages");

		messagesRef.on('value', snapshot => {
			const data = snapshot.val();
			let messages = []

			Object.keys(data).forEach(key => {
				messages.push ({
					id: key,
					username: data[key].username,
					content: data[key].content
				})
				
			});

			state.messages = messages;
		})
	})

    return {
		Login,
		inputUsername,
		state,
		inputMessage,
		sendMessage, 
		Logout
    }
  }
}
</script>

<style scoped>
* {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

form.login-form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.form-inner {
  display: block;
  background-color: #FFF;
  padding: 50px;
  border-radius: 16px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}
.form-inner h1 {
  color: #178b5f;
  font-weight: 900;
  font-size: 36px;
  margin-bottom: 50px;
}
.form-inner label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #AAA;
  font-size: 22px;
  transition: 0.3s;
}
.form-inner input[type="text"] {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  background-color: #F3F3F3;
  transition: 0.4s;
}
.form-inner input[type="text"]::placeholder {
  color: #888;
  transition: 0.4s;
}
.form-inner input[type="submit"] {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #178b5f;
  border-radius: 10px;
  color: #FFF;
  font-size: 18px;
  font-weight: 700;
}
.form-inner:focus-within label {
  color: #178b5f;
}
.form-inner:focus-within input[type="text"] {
  background-color: #FFF;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}
.form-inner:focus-within input[type="text"]::placeholder {
  color: #666;
}
.view.chat {
  flex-direction: column;
}
.view.chat header {
  position: relative;
  display: block;
  width: 100%;
  padding: 30px 10px;
}
.view.chat header .logout {
  position: absolute;
  top: 15px;
  right: 15px;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  color: #178b5f;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: right;
}
.view.chat header h1 {
  color: #178b5f;
  font-size: 48px;
  text-align: center;
  font-weight: 900;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.2);
}
.view.chat .chat-box {
  border-radius: 24px 24px 0px 0px;
  background-color: #FFF;
  box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
  flex: 1 1 100%;
  padding: 30px;
}
.view.chat .chat-box .message {
  display: flex;
  margin-bottom: 15px;
}
.view.chat .chat-box .message .message-inner .username {
  color: #888;
  font-size: 16px;
  margin-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
}
.content {
  display: inline-block;
  padding: 10px 20px;
  background-color: #F3F3F3;
  border-radius: 999px;
  font-weight: 600;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  color: #333;
  font-size: 18px;
  line-height: 1.2em;
  text-align: left;
}
.current-user {
  margin-top: 30px;
  justify-content: flex-end;
  text-align: right;
}
.current-user .message-inner {
  max-width: 75%;
}
.current-user .message-inner .content {
  color: #FFF;
  font-weight: 600;
  background-color: #178b5f;
}
.view.chat footer {
  position: sticky;
  bottom: 0px;
  background-color: #FFF;
  padding: 30px;
  box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
}
.view.chat footer form {
  display: flex;
}
.view.chat footer form input[type="text"] {
  flex: 1 1 100%;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px 0px 0px 8px;
  color: #333;
  font-size: 18px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  background-color: #F3F3F3;
  transition: 0.4s;
}
.view.chat footer form input[type="text"]::placeholder {
  color: #888;
  transition: 0.4s;
}
.view.chat footer form input[type="submit"] {
  border: none;
  outline: none;
  padding: 10px 15px;
  border-radius: 0px 8px 8px 0px;
  background-color: #178b5f;
  color: #FFF;
  font-size: 18px;
  font-weight: 700;
}
</style>
