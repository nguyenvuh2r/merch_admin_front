import { getUser } from '@/utils/auth'

export default {
    mounted: (el, binding) => {
        if (!binding.value.length) return
        const user = getUser()
        const permissions = user?.permissions || []
        const allow = permissions.some((permission) => binding.value.includes(permission?.key))
        if (!allow) el.parentNode?.removeChild(el)
    },
}
