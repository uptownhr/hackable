<template>
  <div>
    <h1>Hello world</h1>

    <button @click="auth">Login</button>
    <div id="auth"></div>
  </div>
</template>

<script>
  const netlifyIdentity = require('netlify-identity-widget')

  export default {
    mounted () {
      netlifyIdentity.init({
        container: '#auth' // defaults to document.body,
      })
      console.log('hi')
    },

    methods: {
      auth () {
        console.log(1)
        netlifyIdentity.open()
      }
    }
  }
</script>