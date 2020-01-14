<template>
    <div class="navbar-items">
        <div class="navbar-item greet">
            <div>Good Morning</div>
            <div>Malik</div>
        </div>
        <div class="navbar-item">
            <v-icon>search</v-icon>
        </div>
        <div class="navbar-item">
            <div>Notification</div>
        </div>
        <div class="navbar-item">
            <div>Avatar</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TopBar"
}
</script>

<style scoped>
    .navbar-items {
      display: flex;
    }

    .navbar-item {
      flex-grow: 0.5
    }

    .greet {
      display: flex;
      flex-direction: column;
      flex-grow: 8
    }
</style>