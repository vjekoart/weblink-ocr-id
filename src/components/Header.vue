<template>
    <header>
        <h1>Weblink OCR ID</h1>
    </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class AppHeader extends Vue {}
</script>

<style scoped lang="scss">
@import '../styles/_variables';

header {
    padding: 0.5 * $line-height;

    text-align: center;

    h1 {
        margin: 0;

        font-size: 1.5 * $font-size;
        line-height: 4 * $line-height;

        background-color: $color-black;
        color: $color-white;
    }
}
</style>
