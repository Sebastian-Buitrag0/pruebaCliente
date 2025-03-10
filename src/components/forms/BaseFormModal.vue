<template>
  <q-dialog v-model="showDialog" @hide="onDialogHide">
    <q-card class="form-modal" style="min-width: 350px; max-width: 80vw">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-md">
        <q-form @submit="onSubmit" ref="formRef">
          <!-- Slot para los campos personalizados -->
          <slot name="form-fields" :form-data="formData"></slot>

          <!-- Campos dinámicos basados en la configuración -->
          <div v-for="field in fields" :key="field.name" class="q-mb-md">
            <q-input
              v-if="
                field.type === 'text' ||
                field.type === 'email' ||
                field.type === 'number' ||
                field.type === 'textarea'
              "
              v-model="formData[field.name]"
              :label="field.label"
              :type="field.type === 'textarea' ? 'text' : field.type"
              :rules="field.rules"
              filled
              dense
              :hint="field.hint"
              :autogrow="field.type === 'textarea'"
            />

            <q-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.name]"
              :options="field.options"
              :label="field.label"
              :rules="field.rules"
              filled
              dense
              :hint="field.hint"
              emit-value
              map-options
              behavior="menu"
            />

            <q-toggle
              v-else-if="field.type === 'toggle'"
              v-model="formData[field.name]"
              :label="field.label"
            />
          </div>

          <!-- Slot adicional al final del formulario -->
          <slot name="additional-content"></slot>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <slot name="actions" :submit="onSubmit" :cancel="onCancel">
          <q-btn flat color="negative" label="Cancelar" @click="onCancel" />
          <q-btn flat color="primary" label="Guardar" type="submit" @click="onSubmit" />
        </slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'BaseFormModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Formulario',
    },
    initialData: {
      type: Object,
      default: () => ({}),
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: {},
      showDialog: this.modelValue,
    }
  },
  watch: {
    modelValue(val) {
      this.showDialog = val
      if (val) {
        this.resetFormData()
      }
    },
    showDialog(val) {
      this.$emit('update:modelValue', val)
    },
    initialData: {
      handler(newVal) {
        if (this.showDialog && newVal) {
          this.formData = JSON.parse(JSON.stringify(newVal))
        }
      },
      deep: true,
    },
  },
  methods: {
    resetFormData() {
      // Crear una copia profunda de los datos iniciales
      this.formData = JSON.parse(JSON.stringify(this.initialData))
    },
    onSubmit() {
      // Validar formulario
      this.$refs.formRef?.validate().then((success) => {
        if (success) {
          this.$emit('submit', { ...this.formData })
          this.showDialog = false
        }
      })
    },
    onCancel() {
      this.showDialog = false
      this.$emit('cancel')
    },
    onDialogHide() {
      // Resetear datos al cerrar
      this.$emit('hide')
    },
  },
  created() {
    this.resetFormData()
  },
}
</script>
