<script setup>
import { computed } from 'vue'
import FourZero1 from '../ui/FourZero1.vue'
import { getUser } from '@/utils/auth'

const props = defineProps({
  permissions: {
    type: Array,
    default: () => []
  }
})

const user = getUser()

const isAuthorized = computed(() => {
  if (!props.permissions.length) return true
  return (user?.permissions || []).some((permission) => props.permissions.includes(permission?.key))
})
</script>

<template>
  <template v-if="isAuthorized">
    <slot></slot>
  </template>

  <FourZero1 v-else :permissions="permissions" />
</template>
