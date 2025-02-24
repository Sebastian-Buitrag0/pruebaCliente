import { boot } from 'quasar/wrappers'
import { Quasar, Notify } from 'quasar'

export default boot(({ app }) => {
  app.use(Quasar, {
    plugins: { Notify },
    config: {
      notify: {},
    },
  })
})
