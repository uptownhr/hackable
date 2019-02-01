<template>
  <div>
    <h1>Hello world</h1>
    <pre>{{user}}</pre>
    <button v-if="!user" @click="auth">Login</button>
    <button v-else @click="logout">Logout</button>
  </div>
</template>

<script>
  const netlifyIdentity = require('netlify-identity-widget')

  export default {
    data () {
      return {
        user: null
      }
    },
    mounted () {
      netlifyIdentity.on('init', user => this.login(user))
      netlifyIdentity.on('login', user => this.login(user))
      netlifyIdentity.on('logout', () => console.log('Logged out'))
      netlifyIdentity.on('error', err => console.error('Error', err))
      netlifyIdentity.on('open', () => console.log('Widget opened'))
      netlifyIdentity.on('close', () => console.log('Widget closed'))

      netlifyIdentity.init()
      const userx = netlifyIdentity.currentUser()

      console.log('hi', userx)



    },

    methods: {
      login ( user) {
        console.log('nothing?', this)
        this.user = user
      },
      auth () {
        console.log(1)
        netlifyIdentity.open()
      },
      logout () {
        netlifyIdentity.logout()
        this.user = null
      }
    }
  }
</script>