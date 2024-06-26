<template>
  <AuthorizationFallback :permissions="['admin']">
    <div class="header">
      <h2>All pages</h2>
      <div class="header-dropdown m-r--5">
        <button @click="newPage()" type="button" class="btn btn-sm cbtn-raised btn-default waves-effect">
          <i class="material-icons">add</i>
        </button>
      </div>
    </div>
    <EasyDataTable
      :theme-color="theme"
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      v-model:items-selected="itemsSelected"
      :headers="headers"
      :items="items"
      alternating
      buttons-pagination
    >
      <template #loading>
        <img
          src="/assets/images/loading.gif"
          style="width: 100px; height: 80px"
        />
      </template>
      <template #item-isPublish="item">
        <div class="switch">
          <label>
            <input type="checkbox" :checked="item.isPublish" @click="setStatus(!item.isPublish, item.id)" />
            <span class="lever switch-col-amber"></span
          ></label>
        </div>
      </template>
      <template #item-isIndex="item">
        <div class="switch">
          <label>
            <input type="checkbox" :checked="item.isIndex" @click="setIndex(!item.isIndex, item.id)" />
            <span class="lever switch-col-amber"></span
          ></label>
        </div>
      </template>
      <template #item-title="item">
        <a :href="buildPageUrl(item)" :title="item.title" target="_blank">{{ item.title }}</a>
      </template>
      <template #item-operation="item">
        <div class="operation-wrapper">
          <div
            class="icon-circle"
            v-permissions="['admin']"
            @click="redirectToUpdate(item.id)"
          >
            <i class="zmdi zmdi-edit"></i>
          </div>
          <div
            class="icon-circle"
            v-permissions="['admin']"
            @click="showDelete(item.id)"
          >
            <i class="zmdi zmdi-delete"></i>
          </div>
        </div>
      </template>
      <template #expand="item">
        <div class="media mleft" style="margin-top: 20px">
          <div class="media-left">
            <a href="javascript:void(0);">
              <img class="media-object" :src="buildPageMediaUrl(item.image, '300x300')" width="64" height="64" alt="" />
            </a>
          </div>
          <div class="media-body">
            <h4 class="media-heading">
              Version: {{ item.version }} - Last modified: {{ formatDateTime(item.modifyTime) }}
            </h4>
            {{ item.summary }}
          </div>
        </div>
      </template>
    </EasyDataTable>
  </AuthorizationFallback>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'
import modalToast from '@/utils/modalToast'
import router from '@/router'
import utils from '@/utils/utils'

const { showToast, showConfirmModal } = modalToast()
const { formatDateTime, buildPageMediaUrl, buildPageUrl } = utils()

const api = inject('api')

const errrorMessage = ref('')

// List region
const itemsSelected = ref([])
const theme = ref('#f48225')
const loading = ref(false)
const queryParams = ref({ pageSize: 25, page: 1 })

const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 25
})

const headers = ref([
  { text: 'ID', value: 'id' },
  { text: 'Title', value: 'title' },
  { text: 'Slug', value: 'slug' },
  { text: 'Published', value: 'isPublish' },
  { text: 'Index', value: 'isIndex' },
  { text: 'Operation', value: 'operation' }
])

const items = ref([])

onMounted(async () => {
  const { page, rowsPerPage } = serverOptions.value
  queryParams.value = { ...queryParams.value, pageSize: rowsPerPage, page: page }
  await loadData(queryParams.value)
})

watch(
  serverOptions,
  async () => {
    const { page, rowsPerPage } = serverOptions.value
    queryParams.value = { ...queryParams.value, pageSize: rowsPerPage, page: page }
    await loadData(queryParams.value)
  },
  { deep: true }
)
// End list region

const loadData = async (queryParams) => {
  loading.value = true
  try {
    var res = await api.page.all(queryParams)
    items.value = res.data
    serverItemsLength.value = res.pagination.totalItemCount
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    loading.value = false
  }
}

const newPage = async () => {
  try {
    const res = await api.page.addDraft()
    router.push({ name: 'website-page-create', params: { id: res.data.id } })
  } catch (err) {
    showToast(err.message, 'error')
  }
}

const showDelete = (id) => {
  showConfirmModal(null, async (confirmed) => {
    if (!confirmed) return

    try {
      await api.page.del(id)
      showToast(`Page with id "${id}" deleted successfully...`)
      await loadData(queryParams.value)
    } catch (err) {
      errrorMessage.value = err.message
      showToast(err.message, 'error')
    } finally {
      loading.value = false
    }
  })
}

const redirectToUpdate = async (pageId) => {
  try {
    router.push({ name: 'website-page-create', params: { id: pageId } })
  } catch (err) {
    showToast(err.message, 'error')
  }
}

const setStatus = async (isPublish, pageId) => {
  try {
    if (isPublish) {
      await api.page.publish(pageId)
      showToast('Page published successfully...')
    }
    else {
      await api.page.unPublish(pageId)
      showToast('Page unpublished successfully...')
    }
  } catch (err) {
    showToast(err.message, 'error')
  }
  await loadData(queryParams.value)
}

const setIndex = async (isIndex, pageId) => {
  try {
    if (isIndex) {
      await api.page.setIndex(pageId)
      showToast('Page set index successfully...')
    }
    else {
      await api.page.noIndex(pageId)
      showToast('Page no index successfully...')
    }
  } catch (err) {
    showToast(err.message, 'error')
  }
  await loadData(queryParams.value)
}
</script>

<style scoped>
.operation-wrapper {
  display: flex;
}

.operation-wrapper div {
  cursor: pointer;
  margin-right: 4px;
}
.icon-circle {
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%; /* Tạo hình tròn */
  background-color: #fcfbf2; /* Màu nền mặc định */
  transition: background-color 0.3s; /* Thêm hiệu ứng chuyển đổi màu */
}

/* Hiệu ứng hover */
.icon-circle:hover {
  background-color: #ffdc00; /* Màu nền khi hover */
}

/* Hiệu ứng click */
.icon-circle:active {
  background-color: #4caf50; /* Màu nền khi click */
}

/* Màu của icon */
.icon-circle i {
  color: #3d3d3d; /* Màu icon */
  font-size: 18px; /* Kích thước icon */
}
</style>
