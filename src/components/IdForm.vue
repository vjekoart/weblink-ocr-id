<template>
    <form>
        <h2>Person Information</h2>
        <div class="form-group">
            <label for="secondary-identifier">First name</label>
            <input id="secondary-identifier" type="text" v-model="secondaryIdentifier">
        </div>

        <div class="form-group">
            <label for="primary-identifier">Last name</label>
            <input id="primary-identifier" type="text" v-model="primaryIdentifier">
        </div>

        <div class="form-group">
            <label for="date-of-birth">Date of birth</label>
            <input id="date-of-birth" type="text" v-model="dateOfBirth">
        </div>

        <div class="form-group">
            <label for="document-number">Document number</label>
            <input id="document-number" type="text" v-model="documentNumber">
        </div>

        <template v-if="data">
            <h2>Data Validation</h2>
            <ul class="validity">
                <li>Date of birth: <strong v-bind:class="{ valid: dateOfBirthValidity }">{{ getValidityMessage(dateOfBirthValidity) }}</strong></li>
                <li>Date of expiry: <strong v-bind:class="{ valid: dateOfExpiryValidity }">{{ getValidityMessage(dateOfExpiryValidity) }}</strong></li>
                <li>Document number: <strong v-bind:class="{ valid: documentNumberValidity }">{{ getValidityMessage(documentNumberValidity) }}</strong></li>
            </ul>
        </template>

        <template v-if="!data">
            <p class="usage-message"><strong>Note:</strong> use applet below to scan ID.</p>
        </template>
    </form>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { MrzInformation } from '../helpers/mrz'

@Component
export default class AppIdForm extends Vue {
    @Prop() data!: MrzInformation

    dateOfBirth = ''
    documentNumber = ''
    primaryIdentifier = ''
    secondaryIdentifier = ''

    dateOfBirthValidity = false
    dateOfExpiryValidity = false
    documentNumberValidity = false

    @Watch('data')
    onPropertyChanged (newValue: MrzInformation) {
        if (!newValue) {
            return
        }

        if (newValue.data) {
            this.dateOfBirth = newValue.data.dateOfBirth
            this.documentNumber = newValue.data.documentNumber
            this.primaryIdentifier = newValue.data.primaryIdentifier
            this.secondaryIdentifier = newValue.data.secondaryIdentifier
        }

        if (newValue.validity) {
            this.dateOfBirthValidity = newValue.validity.dateOfBirth
            this.dateOfExpiryValidity = newValue.validity.dateOfExpiry
            this.documentNumberValidity = newValue.validity.documentNumber
        }
    }

    mounted () {
        if (!this.data) {
            return
        }

        if (this.data.data) {
            this.dateOfBirth = this.data.data.dateOfBirth
            this.documentNumber = this.data.data.documentNumber
            this.primaryIdentifier = this.data.data.primaryIdentifier
            this.secondaryIdentifier = this.data.data.secondaryIdentifier
        }

        if (this.data.validity) {
            this.dateOfBirthValidity = this.data.validity.dateOfBirth
            this.dateOfExpiryValidity = this.data.validity.dateOfExpiry
            this.documentNumberValidity = this.data.validity.documentNumber
        }
    }

    getValidityMessage (status: boolean): string {
        if (status) {
            return 'valid'
        }

        return 'invalid'
    }
}
</script>

<style scoped lang="scss">
@import '../styles/_variables';

form {
    margin: 0;
    padding: 0.5 * $line-height;
}

.form-group {
    margin: 0 0 0.5 * $line-height 0;

    &:last-of-type {
        margin-bottom: $line-height;
    }
}

label {
    display: block;

    font-size: 0.8 * $font-size;
    font-style: italic;

    color: $color-gray-dark;
}

input {
    display: block;

    width: 100%;
    margin: 0;
    padding: 0 0.5 * $font-size;

    line-height: $line-height;
}

.validity {
    margin: 0;
    padding: 0 $line-height;

    strong {
        color: $color-red;

        &.valid {
            color: $color-green;
        }
    }
}
</style>
