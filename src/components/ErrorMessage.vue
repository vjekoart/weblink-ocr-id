<template>
    <p>{{ message }}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class AppErrorMessage extends Vue {
    @Prop() message?: string
}
</script>

<style scoped lang="scss">
@import '../styles/_variables';

p {
    margin: 0;
    padding: 0;

    color: $color-red;

    font-size: $font-size;
    font-weight: bold;
    line-height: 2 * $line-height;

    text-align: center;
}
</style>
