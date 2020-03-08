<template>
    <div>
      Dashboard
    </div>
</template>

<script>

export default {
    name: "Dashboard",
    data() {
      return {
        events: [],
        hidden: false
      }
    },
    methods: {
    eventDisplay: event => event.customAttribute
  }
}
</script>

<style>

</style>