<template>
    <div id="app">
        <AppHeader />
        <main>
            <AppIdForm v-bind:data="mrzInformation" />
            <AppErrorMessage v-if="mrzErrorMessage" v-bind:message="mrzErrorMessage" />
            <AppMicroblinkUI v-on:mrz-event="parseMrz" v-on:mrz-event-error="mrzError" />
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import {
    MrzUtilityInterface,
    MrzUtility,
    MrzInformation
} from './helpers/mrz'

import AppHeader from './components/Header.vue'
import AppErrorMessage from './components/ErrorMessage.vue'
import AppIdForm from './components/IdForm.vue'
import AppMicroblinkUI from './components/MicroblinkUI.vue'

@Component({
    components: {
        AppHeader,
        AppErrorMessage,
        AppIdForm,
        AppMicroblinkUI
    }
})
export default class App extends Vue {
    mrz: MrzUtilityInterface = new MrzUtility()
    mrzErrorMessage: string|null = null
    mrzInformation: MrzInformation|null = null

    parseMrz (event: string) {
        this.mrzErrorMessage = null
        this.mrzInformation = this.mrz.extractMrzInformation(event)
    }

    mrzError (event: any) {
        this.mrzErrorMessage = event.message
        this.mrzInformation = null
    }
}
</script>

<style lang="scss">
@import 'styles/styles.scss';

#app {
    width: 100%;
    max-width: 600px;

    margin: 0 auto;
    padding: 0.5 * $line-height;
}
</style>
