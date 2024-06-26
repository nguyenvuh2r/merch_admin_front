<template>
  <AuthorizationFallback :permissions="['ecom-cat-all', 'admin']">
    <div class="header">
      <h2>All blog categories</h2>
      <div class="header-dropdown m-r--5">
        <button @click="showModal('create')" type="button" class="btn btn-sm cbtn-raised btn-default waves-effect">
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
      <template #item-parentId="item">
        {{ categories.find((x) => x.id == item.parentId)?.name }}
      </template>
      <template #item-title="item">
        <a :href="buildCategoryUrl(item)" :title="item.name" target="_blank">{{ item.name }}</a>
      </template>
      <template #item-operation="item">
        <div class="operation-wrapper">
          <div class="icon-circle" v-permissions="['blog-cat-update', 'admin']" @click="showModal('update', item)">
            <i class="zmdi zmdi-edit"></i></div
          >
          <div class="icon-circle" v-permissions="['blog-cat-delete', 'admin']" @click="showDelete(item.id)">
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
                  <label class="mt-0"><b>Name</b></label>
                  <div class="form-line" :class="{ error: formErrors?.Name }">
                    <input type="text" v-model="formData.Name" @input="updateSlug" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formErrors?.Name">{{
                    formErrors?.Name
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Slug</b></label>
                  <div class="form-line" :class="{ error: formErrors?.Slug }">
                    <input type="text" v-model="formData.Slug" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formErrors?.Slug">{{
                    formErrors?.Slug
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Parent</b></label>
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
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Meta</b></label>
                  <div class="form-line" :class="{ error: formErrors?.Meta }">
                    <input type="text" v-model="formData.Meta" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formErrors?.Meta">{{
                    formErrors?.Meta
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Meta keywords</b></label>
                  <div class="form-line" :class="{ error: formErrors?.MetaKeywords }">
                    <input type="text" v-model="formData.MetaKeywords" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formErrors?.MetaKeywords">{{
                    formErrors?.MetaKeywords
                  }}</label>
                </div>
              </div>
              <div class="col-lg-12 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Meta description</b></label>
                  <div class="form-line" :class="{ error: formErrors?.MetaDescription }">
                    <textarea
                      v-model="formData.MetaDescription"
                      rows="1"
                      class="form-control no-resize auto-growth"
                    ></textarea>
                  </div>
                  <label class="error text-left" v-show="formErrors?.MetaDescription">{{
                    formErrors?.MetaDescription
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="font-weight-bold mt-0"><b>Meta image</b></label>
                  <div v-bind="getImageRootProps()" class="dropzone dz-clickable">
                    <input v-bind="getImageInputProps()" />
                    <div class="dz-message">
                      <div class="drag-icon-cph"><i class="material-icons">touch_app</i></div>
                      <p>Drop files here or click to upload.</p>
                    </div>
                  </div>
                  <div v-if="selectedImage.name" class="inbox">
                    <ul class="mail_list list-group list-unstyled">
                      <li class="list-group-item">
                        <div class="media">
                          <div class="pull-left">
                            <div class="thumb hidden-sm-down m-r-20">
                              <img :src="selectedImage.url" alt="Category meta image" />
                            </div>
                          </div>
                          <div class="media-body">
                            <p class="msg">{{ selectedImage.name }}</p>
                            <small class="float-right text-muted">
                              <span class="remove-selected-image" @click="removeSelectedImage"
                                ><i class="zmdi zmdi-delete"></i
                              ></span>
                            </small>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <label
                    class="error text-left"
                    v-if="selectImageReject !== ''"
                    id="isCoverImageDragReject"
                    >{{ selectImageReject }}</label
                  >
                  <label class="error text-left" v-show="formErrors?.MetaImageFile">{{
                    formUserErrors?.MetaImageFile
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
import { ref, inject, watch, onMounted, reactive } from 'vue'
import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'
import modalToast from '@/utils/modalToast'
import validation from '@/utils/validation'
import utils from '@/utils/utils'
import { useDropzone } from 'vue3-dropzone'
import * as yup from 'yup'

const { showConfirmModal, showToast } = modalToast()
const { buildCategoryUrl, buildPostMediaUrl } = utils()

const api = inject('api')
const categories = ref([])

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
  { text: 'Name', value: 'name' },
  { text: 'Slug', value: 'slug' },
  { text: 'Parent', value: 'parentId' },
  { text: 'Operation', value: 'operation' }
])

const items = ref([])

onMounted(async () => {
  const { page, rowsPerPage } = serverOptions.value
  queryParams.value = { ...queryParams.value, pageSize: rowsPerPage, page: page }
  await loadData(queryParams.value)
  await loadCategories()

  autosize($('textarea.auto-growth'))
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
    Slug: '',
    ParentId: 0,
    MetaImageFile: null,
    Meta: '',
    MetaKeywords: '',
    MetaDescription: ''
  }
}
const formData = ref(initialFormData())
const formErrors = ref({})
const formSchema = yup.object({
  Name: yup.string().required().min(2),
  Slug: yup.string().required().min(2),
  ParentId: yup.number().required().integer().min(0),
  MetaImageFile: yup
    .mixed()
    .nullable(true)
    .test('fileFormat', 'File format not supported', (value) => {
      if (!value) return true
      return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    })
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true
      return value && value.size <= 5 * 1024 * 1024 // 5MB
    }),
})
const handleFormErrors = (errorData) => {
  let errors = {}
  errorData.forEach((error) => {
    const { propertyName, errorMessage } = error

    errors[propertyName] = errorMessage
  })
  formErrors.value = errors
}

// Cover image drop zone region
const selectedImage = ref({
  name: '',
  type: '',
  url: '',
  size: 0,
  file: ''
})
const selectImageReject = ref('')
const removeSelectedImage = () => {
  selectedImage.value = {}
  selectImageReject.value = ''

  formData.value.MetaImageFile = null
}
const onImageDrop = async (acceptedFiles, rejectReasons) => {
  selectImageReject.value = ''
  if (acceptedFiles.length > 0) {
    selectedImage.value.size = acceptedFiles[0].size
    selectedImage.value.type = acceptedFiles[0].type
    selectedImage.value.name = acceptedFiles[0].name
    selectedImage.value.file = acceptedFiles[0]

    const reader = new FileReader()
    reader.onload = () => {
      selectedImage.value.url = reader.result
    }
    reader.readAsDataURL(acceptedFiles[0])

    formData.value.MetaImageFile = selectedImage.value.file
  }

  if (rejectReasons.length > 0) {
    selectImageReject.value = rejectReasons[0].errors[0].message
  }
}
const options = reactive({
  multiple: false,
  onDrop: onImageDrop,
  accept: ['.jpg', '.jpeg', '.png']
})
const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
  useDropzone(options)
// End Cover image drop zone region

const showModal = async (mod, item = null) => {
  mode.value = mod
  errrorMessage.value = ''

  resetForm()
  removeSelectedImage()

  if (mod == 'create') {
    $('.select-picker-parent').selectpicker('val', 0)
  }
  if (mod == 'update' && item != null) {
    selectedItem.value = item
    formData.value = {
      Name: item.name,
      Slug: item.slug,
      ParentId: item.parentId,
      Meta: item.meta,
      MetaImageFile: null,
      MetaKeywords: item.metaKeywords,
      MetaDescription: item.metaDescription
    }

    selectedImage.value.name = selectedItem.value.metaImage
    selectedImage.value.url = buildPostMediaUrl(selectedItem.value.metaImage)

    $('.select-picker-parent').selectpicker('val', item.parentId)
  }

  $('select[class^="select-picker"]').selectpicker('refresh')

  autosize($('textarea.auto-growth'))
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
const updateSlug = () => {
  formData.value.Slug = generateSlug(formData.value.Name)
}
// End form region

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
}
const showDelete = (id) => {
  showConfirmModal(null, async (confirmed) => {
    if (!confirmed) return

    try {
      await api.blogCategory.del(id)
      showToast(`Category with id "${id}" deleted successfully...`)
      await loadData(queryParams.value)
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
