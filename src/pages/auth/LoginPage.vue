<script setup>
import { ref } from 'vue'
import {
  useQuasar
} from 'quasar'
import loginService from 'src/services/auth/login.js'

import { useRouter } from 'vue-router'

const $q = useQuasar();
const router = useRouter();

const username = ref('')
const password = ref('')

// const { proxy } = getCurrentInstance()

async function login() {
  try {
    const payload = {
      username: username.value,
      password: password.value
    }
    const response = await loginService.login(payload)
    console.log('Datos recibidos:', response.data)
    router.push('/products')
  } catch (error) {
    console.error('Usuario o Contraseña Incorrectos: ', error)
    $q.notify({
      message: 'Usuario o contraseña incorrectos!',
      color: 'negative',
      position: 'top'
    })
  }
}
</script>
<template>
  <q-page class="flex flex-center bg-grey-2">
    <div class="login-box">
      <h3 class="text-weight-bold q-mb-md">LOGIN</h3>
      <q-input rounded standout v-model="username" label="Username" class="q-mb-sm full-width" />
      <q-input rounded standout v-model="password" label="Password" type="password" class="q-mb-md full-width" />
      <q-btn label="Sign in" color="primary" class="full-width" unelevated @click="login" />
    </div>
  </q-page>
</template>

<style scoped>
.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.full-width {
  width: 100%;
}

h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  align-self: center;
}
</style>
