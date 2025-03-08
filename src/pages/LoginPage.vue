<template>
  <q-page class="flex flex-center">
    <q-card class="login-card q-pa-lg">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Iniciar Sesión</div>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="Nombre de usuario"
            :rules="[(val) => !!val || 'El nombre de usuario es requerido']"
          />

          <q-input
            v-model="form.password"
            label="Contraseña"
            :type="isPwd ? 'password' : 'text'"
            :rules="[(val) => !!val || 'La contraseña es requerida']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Iniciar Sesión"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section v-if="error" class="text-negative text-center">
        {{ error }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    const form = ref({
      username: '',
      password: '',
    })

    const isPwd = ref(true)
    const loading = ref(false)
    const error = ref('')

    const onSubmit = async () => {
      loading.value = true
      error.value = ''

      try {
        const success = await authStore.login(form.value)
        if (success) {
          const redirectPath = route.query.redirect || '/'
          router.push(redirectPath)
        } else {
          error.value = 'Credenciales inválidas'
        }
      } catch (err) {
        error.value = err.message || 'Error al iniciar sesión'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      isPwd,
      loading,
      error,
      onSubmit,
    }
  },
}
</script>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
