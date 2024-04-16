<script setup>
import utils from '../../utils/utils'

defineProps({
    permissions: {
        type: Array,
        default: () => [],
    },
})

const { stringCapitalize } = utils()
</script>

<template>
    <div>
        <h2>401 UnAuthorized</h2>
        <p>
            {{
                permissions
                    .map((permission) =>
                        stringCapitalize(permission?.replaceAll('-', ' ')),
                    )
                    ?.join(', ')
            }}
        </p>
    </div>
</template>
