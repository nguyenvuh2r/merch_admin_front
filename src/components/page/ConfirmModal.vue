<script setup>
import { ref, computed } from 'vue'
import emitter from 'tiny-emitter/instance'
import utils from '@/utils/utils'

const { isObject, isEmptyObject } = utils()

const show = ref(false)
const initialModalData = computed(() => ({
    message: 'Are you sure to delete?',
    actionButton: {
        text: 'Proceed',
    },
    returnButton: {
        text: 'Go back',
    },
}))
const setModalData = (data) => {
    if (!data || !isObject(data) || isEmptyObject(data))
        return initialModalData.value
    const { message, actionButton, returnButton } = data

    const mergedData = {
        ...initialModalData.value,
        message: message ? message : initialModalData.value.message,
        actionButton: actionButton
            ? actionButton
            : initialModalData.value.actionButton,
        returnButton: returnButton
            ? returnButton
            : initialModalData.value.returnButton,
    }

    return mergedData
}
const modalData = ref(initialModalData.value)

const onButtonClick = (callback, confirmed) => {
    show.value = false
    callback(confirmed)
}

emitter.on('show-confirm-modal', (data, callback) => {
    show.value = true
    modalData.value = setModalData(data)

    setTimeout(() => {
        const actionButton = document.querySelector('#action-button')
        const returnButton = document.querySelector('#return-button')
        const overlay = document.querySelector('#confirm-modal-overlay')

        if (actionButton)
            actionButton.addEventListener('click', () => {
                onButtonClick(callback, true)
                actionButton.removeEventListener('click', () => {
                    onButtonClick(callback, true)
                })
            })
        if (returnButton)
            returnButton.addEventListener('click', () => {
                onButtonClick(callback, false)
                returnButton.removeEventListener('click', () => {
                    onButtonClick(callback, false)
                })
            })

        if (overlay)
            overlay.addEventListener('click', () => {
                onButtonClick(callback, null)
                overlay.removeEventListener('click', () => {
                    onButtonClick(callback, null)
                })
            })
    }, 100)
})
</script>

<template>
    <Teleport to="body">
        <!-- overlay -->
        <div v-if="show" id="confirm-modal-overlay" class="sweet-overlay" tabindex="-1"
            style="opacity: 1.11; display: block;"></div>

        <!-- modal -->
        <div v-if="show" class="sweet-alert showSweetAlert visible" data-custom-class="" data-has-cancel-button="true"
            data-has-confirm-button="true" data-allow-outside-click="false" data-has-done-function="true"
            data-animation="pop" data-timer="null" style="display: block; margin-top: -149px;">
            <div class="sa-icon sa-error" style="display: none;">
                <span class="sa-x-mark">
                    <span class="sa-line sa-left"></span>
                    <span class="sa-line sa-right"></span>
                </span>
            </div>
            <div class="sa-icon sa-warning pulseWarning" style="display: block;">
                <span class="sa-body pulseWarningIns"></span>
                <span class="sa-dot pulseWarningIns"></span>
            </div>
            <div class="sa-icon sa-info" style="display: none;"></div>
            <div class="sa-icon sa-success" style="display: none;">
                <span class="sa-line sa-tip"></span>
                <span class="sa-line sa-long"></span>

                <div class="sa-placeholder"></div>
                <div class="sa-fix"></div>
            </div>
            <div class="sa-icon sa-custom" style="display: none;"></div>
            <h2>Are you sure?</h2>
            <p style="display: block;">{{ modalData.message }}</p>
            <fieldset>
                <input type="text" tabindex="3" placeholder="">
                <div class="sa-input-error"></div>
            </fieldset>
            <div class="sa-error-container">
                <div class="icon">!</div>
                <p>Not valid!</p>
            </div>
            <div class="sa-button-container">
                <button id="return-button" class="cancel" tabindex="2"
                    style="display: inline-block; box-shadow: none;">{{
                        modalData.returnButton.text }}</button>
                <div class="sa-confirm-button-container">
                    <button id="action-button" class="confirm" tabindex="1"
                        style="display: inline-block; background-color: rgb(221, 107, 85); box-shadow: rgba(221, 107, 85, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;">{{
                            modalData.actionButton.text }}</button>
                    <div class="la-ball-fall">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
