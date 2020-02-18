<template>
    <div class="wrapper">
        <microblink-ui-web tabs autoscroll>
            <img slot="loader-image" class="hide-until-component-is-loaded" src="https://microblink.com/bundles/microblinkmicroblink/images/loading-animation-on-blue.gif" />
            <span slot="labels.openLinkAtSmartphone" class="hide-until-component-is-loaded">Please open <b>exchange link</b> at the smartphone with <b>QR</b> reader.</span>
        </microblink-ui-web>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import environment from '../environment'
import 'microblink/dist/microblink.js'

declare const Microblink: any

@Component
export default class AppMicroblinkUI extends Vue {
    mounted () {
        // Default endpoint is used
        // Microblink.SDK.SetEndpoint('https://api.microblink.com')

        // As noted in the task, MRTD recognizer should be used
        Microblink.SDK.SetRecognizers(['MRTD'])

        // Authorization header
        Microblink.SDK.SetAuthorization(`Bearer ${environment.token}`)

        // There is no need for API to return extracted images
        Microblink.SDK.SetExportImages(false)

        Microblink.SDK.RegisterListener({
            onScanSuccess: (data: any) => {
                const results = data.result.data instanceof Array ? data.result.data : [data.result.data]

                for (let i = 0; i < results.length; i++) {
                    if (results[i].result == null) {
                        results.splice(i, 1)
                    }
                }

                if (results.length < 1) {
                    this.$emit('mrz-event-error', 'Could not find data!')
                } else {
                    // Pass 'rawMRZString' property from 'MRTD' recognizer as component output
                    this.$emit('mrz-event', results[0].result.rawMRZString)
                }
            },

            onScanError: (error: any) => {
                console.log('onScanError', error)
                this.$emit('mrz-event-error', 'Could not extract data!')
            }
        })

        // Proposed UI improvement
        setTimeout(() => {
            document
                .querySelectorAll('.hide-until-component-is-loaded')
                .forEach(element => {
                    element.classList.remove('hide-until-component-is-loaded')
                })
        }, 1000)
    }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables';

.wrapper {
    width: 100%;
    height: 500px;

    margin: 0 auto;
    padding: 0.5 * $line-height;

    position: relative;
    overflow: hidden;
}

microblink-ui-web {
    --mb-widget-font-family: $font-family;
    --mb-hem: 1rem;
    --mb-widget-border-width: 0.5 * $line-height;

    /* Defaults */
    --mb-widget-border-color: $color-black;
    --mb-widget-background-color: $color-white;
    --mb-default-font-color: $color-black;
    --mb-alt-font-color: #575757;
    --mb-btn-font-color: $color-white;
    --mb-btn-background-color: #48b2e8;
    --mb-btn-background-color-hover: #26a4e4;
    --mb-btn-flip-color: $color-white;
    --mb-btn-alt-font-color: $color-black;
    --mb-btn-alt-background-color: $color-white;
    --mb-btn-border-radius: 0;
    --mb-btn-intro-stroke-color: black;
    --mb-btn-intro-stroke-color-hover: $color-white;
    --mb-btn-intro-circle-color: #f2f2f2;
    --mb-btn-intro-circle-color-hover: #48b2e8;
    --mb-btn-container-border-color: lightgrey;
    --mb-spinner-border-width: 0.5 * $line-height;
    --mb-tabs-background-color: $color-black;
    --mb-tabs-font-color: $color-white;
    --mb-tabs-border-width: 0.5 * $line-height;
    --mb-btn-icon-cancel-color: $color-white;
    --mb-dropzone-hover-color: rgba(72, 178, 232, 0.2);
    --mb-dropzone-circle-color: #48b2e8;
    --mb-dropzone-icon-color: $color-black;
    --mb-loader-font-color: $color-black;
    --mb-loader-background-color: #48b2e8;
    --mb-card-layout-border-color: $color-black;
    --mb-tabs-hover-color: #26a4e4;
    --mb-tabs-active-color: #48b2e8;
    --mb-json-color-key: $color-black;
    --mb-json-color-string: #48b2e8;
    --mb-json-color-boolean: #26a4e4;
    --mb-json-color-number: $color-black;
    --mb-json-color-null: #26a4e4;
    --mb-results-border-color: #dee2e6;
    --mb-results-image-border-radius: 0.25 * $line-height;
    --mb-results-image-background-color: #f2f2f2;
    --mb-dialog-title-color: $color-black;
    --mb-dialog-message-color: #575757;
    --mb-photo-icon-primary: $color-white;
    --mb-photo-icon-accent: #48b2e8;
}

microblink-ui-web .hide-until-component-is-loaded {
    visibility: hidden;
}
</style>
