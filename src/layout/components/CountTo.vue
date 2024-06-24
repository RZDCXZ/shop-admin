<script setup lang="ts">
import gsap from 'gsap'
import { reactive, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        value: number
    }>(),
    {
        value: 0,
    },
)

const d = reactive({
    num: 0,
})

const animateToValue = () => {
    gsap.to(d, {
        duration: 0.5,
        num: props.value,
    })
}

animateToValue()

watch(
    () => props.value,
    () => animateToValue(),
)
</script>

<template>
    {{ d.num.toFixed(2) }}
</template>

<style scoped></style>
