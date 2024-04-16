<template>
  <AuthorizationFallback :permissions="['blog-cat-all', 'admin']">
    <div class="header">
      <h2>All blog categories</h2>
      <ul class="header-dropdown m-r--5">
        <li class="dropdown">
          <a
            href="javascript:void(0);"
            class="dropdown-toggle"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="zmdi zmdi-more-vert"></i>
          </a>
          <ul class="dropdown-menu pull-right">
            <li v-permissions="['blog-cat-create', 'admin']">
              <a @click="showModal('create', 0)">Add category</a>
            </li>
          </ul>
        </li>
      </ul>
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
          src="https://i.pinimg.com/originals/94/fd/2b/94fd2bf50097ade743220761f41693d5.gif"
          style="width: 100px; height: 80px"
        />
      </template>
      <template #item-parentId="item">
        {{ categories.find((x) => x.id == item.parentId)?.name }}
      </template>
      <template #item-operation="item">
        <div class="operation-wrapper">
          <div class="icon-circle" v-permissions="['blog-cat-update', 'admin']" @click="showModal('update', item)">
            <i class="zmdi zmdi-edit"></i></div
          >
          <div class="icon-circle" v-permissions="['blog-cat-delete', 'admin']" @click="showDeleteCat(item.id)">
            <i class="zmdi zmdi-delete"></i></div
          >
        </div>
      </template>
    </EasyDataTable>
    <!-- Category Modal -->
    <div class="modal fade" id="catModal" tabindex="-1" role="dialog" ref="catModal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{
                mode == 'create' ? 'Create New Category' : 'Edit Category: ' + selectedItem?.name
              }}
            </h4>
          </div>
          <div class="modal-body">
            <div v-if="errrorMessage != ''" class="alert alert-danger">{{ errrorMessage }}</div>
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0">Name</label>
                  <div class="form-line" :class="{ error: formErrors?.Name }">
                    <input type="text" v-model="formData.Name" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formErrors?.Name">{{
                    formErrors?.Name
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0">Parent</label>
                  <div :class="{ error: formErrors?.ParentId }">
                    <select
                      v-model="formData.ParentId"
                      class="select-picker-parent form-control show-tick"
                    >
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>
                  <label class="error text-left" v-show="formErrors?.ParentId">{{
                    formErrors?.ParentId
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="onFormSubmit" class="btn btn-link waves-effect">
              SAVE CHANGES
            </button>
            <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Category Modal -->
  </AuthorizationFallback>
</template>

<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'
import modalToast from '@/utils/modalToast'
import validation from '@/utils/validation'
import * as yup from 'yup'

const { showConfirmModal, showToast } = modalToast()

const api = inject('api')
const categories = ref([])

// List region
const itemsSelected = ref([])
const theme = ref('#f48225')
const loading = ref(false)
const queryParams = ref({ pageSize: 10, page: 1 })

const serverItemsLength = ref(0)
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10
})

const headers = ref([
  { text: 'ID', value: 'id' },
  { text: 'Name', value: 'name' },
  { text: 'Parent', value: 'parentId' },
  { text: 'Operation', value: 'operation' }
])

const items = ref([])

onMounted(async () => {
  const { page, rowsPerPage } = serverOptions.value
  queryParams.value = { ...queryParams.value, pageSize: rowsPerPage, page: page }
  await loadData(queryParams.value)
  await loadCategories()
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
watch(items, async () => {
  await loadCategories()
})
// End list region

// Form region
const selectedItem = ref({})
const catModal = ref(null)
const { runYupValidation } = validation()
const errrorMessage = ref('')
const mode = ref('create')
const initialFormData = () => {
  return {
    Name: '',
    ParentId: 0
  }
}
const formData = ref(initialFormData())
const formErrors = ref({})
const formSchema = yup.object({
  Name: yup.string().required().min(2),
  ParentId: yup.number().required().integer().min(0)
})
const handleFormErrors = (errorData) => {
  let errors = {}
  errorData.forEach((error) => {
    const { propertyName, errorMessage } = error

    errors[propertyName] = errorMessage
  })
  formErrors.value = errors
}
const showModal = async (mod, item = null) => {
  mode.value = mod
  errrorMessage.value = ''
  resetForm()
  if (mod == 'create') {
    $('.select-picker-parent').selectpicker('val', 0)
  }
  if (mod == 'update' && item != null) {
    selectedItem.value = item
    formData.value = {
      Name: item.name,
      ParentId: item.parentId
    }
    $('.select-picker-parent').selectpicker('val', item.parentId)
  }

  $('select[class^="select-picker"]').selectpicker('refresh')
  $(catModal.value).modal('show')
}
const onFormSubmit = async () => {
  loading.value = true

  let data = { ...formData.value }
  const { validated, errors } = await runYupValidation(formSchema, data)
  if (!validated) {
    formErrors.value = errors
    return
  }
  if (mode.value == 'update' && selectedItem.value.id == data.ParentId) {
    errrorMessage.value = 'Parent category cannot be same as selected category'
    return
  }
  formErrors.value = {}

  try {
    const res =
      mode.value == 'create'
        ? await api.blogCategory.add(data)
        : await api.blogCategory.update(selectedItem.value.id, data)
    if (res.data) {
      showToast(
        mode.value == 'create'
          ? `Category "${data.Name}" created successfully...`
          : `User "${data.Name}" updated successfully...`
      )
      loadData(queryParams.value)
      $(catModal.value).modal('hide')
    }
  } catch (err) {
    if (err.errorData) {
      handleFormErrors(err.errorData)
    } else {
      errrorMessage.value = err.message
    }
  } finally {
    loading.value = false
  }
}
const resetForm = () => {
  formData.value = initialFormData()
  formErrors.value = {}
}
// End form region

const showDeleteCat = (catId) => {
  showConfirmModal(null, async (confirmed) => {
    if (!confirmed) return

    try {
      await api.blogCategory.del(catId)
      showToast(`Category with id "${catId}" deleted successfully...`)
    } catch (err) {
      errrorMessage.value = err.message
      showToast(err.message, 'error')
    } finally {
      loading.value = false
    }
  })
}

const loadData = async (queryParams) => {
  loading.value = true
  try {
    var res = await api.blogCategory.all(queryParams)
    items.value = res.data
    serverItemsLength.value = res.pagination.totalItemCount
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    loading.value = false
  }
}
const loadCategories = async () => {
  try {
    var res = await api.blogCategory.deepAll()
    categories.value = [
      { id: 0, name: '[Top-level Category]' },
      ...res.data.map((cat) => {
        return { id: cat.id, name: cat.name }
      })
    ]
  } catch (err) {
    showToast(err.message, 'error')
  }
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
  background-color: #FFDC00; /* Màu nền khi hover */
}

/* Hiệu ứng click */
.icon-circle:active {
  background-color: #4caf50; /* Màu nền khi click */
}

/* Màu của icon */
.icon-circle i {
  color:#3d3d3d; /* Màu icon */
  font-size: 18px; /* Kích thước icon */
}
</style>
