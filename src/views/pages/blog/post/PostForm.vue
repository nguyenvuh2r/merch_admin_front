<template>
  <AuthorizationFallback :permissions="['blog-post-create', 'blog-post-create', 'admin']">
    <div class="header">
      <h2>
        Editing article: <b>{{ post?.title }}</b>
      </h2>
    </div>
    <div class="body">
      <div class="form-group">
        <label class="font-weight-bold mt-0">Article title</label>
        <div class="form-line" :class="{ error: formErrors?.Title }">
          <input type="text" v-model="formData.Title" class="form-control" />
        </div>
        <label class="error text-left" v-show="formErrors?.Title">{{ formErrors?.Title }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Article slug</label>
        <div class="form-line" :class="{ error: formErrors?.Slug }">
          <input type="text" v-model="formData.Slug" class="form-control" />
        </div>
        <label class="error text-left" v-show="formErrors?.Slug">{{ formErrors?.Slug }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Category</label>
        <div :class="{ error: formErrors?.CategoryId }">
          <select
            v-model="formData.CategoryId"
            class="select-picker-category form-control show-tick"
          >
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
        <label class="error text-left" v-show="formErrors?.CategoryId">{{
          formErrors?.CategoryId
        }}</label>
      </div>
      <div class="form-group">
        <label class="mt-0"><b>Summary</b> <i>(Press Enter for new line)</i></label>
        <div class="form-line" :class="{ error: formErrors?.Summary }">
          <textarea
            v-model="formData.Summary"
            rows="1"
            class="form-control no-resize auto-growth"
          ></textarea>
        </div>
        <label class="error text-left" v-show="formErrors?.Summary">{{
          formErrors?.Summary
        }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Content</label>
        <div :class="{ error: formErrors?.Content }">
          <ckeditor
            :editor="editor"
            @ready="onEditorReady"
            v-model="formData.Content"
            :config="editorConfig"
          ></ckeditor>
        </div>
        <label class="error text-left" v-show="formErrors?.Content">{{
          formErrors?.Content
        }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Cover image</label>
        <div v-bind="getCoverImageRootProps()" class="dropzone dz-clickable">
          <input v-bind="getCoverImageInputProps()" />
          <div class="dz-message">
            <div class="drag-icon-cph"><i class="material-icons">touch_app</i></div>
            <h4>Drop files here or click to upload.</h4>
          </div>
        </div>
        <div v-if="selectedImage.name" class="inbox">
          <ul class="mail_list list-group list-unstyled">
            <li class="list-group-item">
              <div class="media">
                <div class="pull-left">
                  <div class="thumb hidden-sm-down m-r-20">
                    <img :src="selectedImage.url" alt="Article cover image" />
                  </div>
                </div>
                <div class="media-body">
                  <p class="msg">{{ selectedImage.name }}</p>
                  <small class="float-right text-muted">
                    <span class="remove-selected-image" @click="removeSelectedCoverImage"
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
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Tags</label>
        <div class="form-line" :class="{ error: formErrors?.Tags }">
          <input
            id="tags"
            type="text"
            class="form-control"
            data-role="tagsinput"
          />
        </div>
        <label class="error text-left" v-show="formErrors?.Tags">{{ formErrors?.Tags }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Meta title</label>
        <div class="form-line" :class="{ error: formErrors?.Meta }">
          <input type="text" v-model="formData.Meta" class="form-control" />
        </div>
        <label class="error text-left" v-show="formErrors?.Meta">{{ formErrors?.Meta }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Meta image</label>
        <div v-bind="getMetaImageRootProps()" class="dropzone dz-clickable">
          <input v-bind="getMetaImageInputProps()" />
          <div class="dz-message">
            <div class="drag-icon-cph"><i class="material-icons">touch_app</i></div>
            <h4>Drop files here or click to upload.</h4>
          </div>
        </div>
        <div v-if="selectedMetaImage.name" class="inbox">
          <ul class="mail_list list-group list-unstyled">
            <li class="list-group-item">
              <div class="media">
                <div class="pull-left">
                  <div class="thumb hidden-sm-down m-r-20">
                    <img :src="selectedMetaImage.url" alt="Article cover image" />
                  </div>
                </div>
                <div class="media-body">
                  <p class="msg">{{ selectedMetaImage.name }}</p>
                  <small class="float-right text-muted">
                    <span class="remove-selected-image" @click="removeSelectedMetaImage"
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
      </div>
      <div class="form-group">
        <label class="font-weight-boldmt-0"
          ><b>Meta description</b> <i>(Press Enter for new line)</i></label
        >
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
      <div class="form-group">
        <label class="font-weight-bold mt-0">Meta author</label>
        <div class="form-line" :class="{ error: formErrors?.MetaAuthor }">
          <input type="text" v-model="formData.MetaAuthor" class="form-control" />
        </div>
        <label class="error text-left" v-show="formErrors?.MetaAuthor">{{
          formErrors?.MetaAuthor
        }}</label>
      </div>
      <div class="form-group">
        <label class="font-weight-bold mt-0">Meta keywords</label>
        <div class="form-line" :class="{ error: formErrors?.MetaKeywords }">
          <input type="text" v-model="formData.MetaKeywords" class="form-control" />
        </div>
        <label class="error text-left" v-show="formErrors?.MetaKeywords">{{
          formErrors?.MetaKeywords
        }}</label>
      </div>
      <div class="button-demo">
        <button type="button" @click="onFormSubmit(true)" class="btn btn-raised btn-primary waves-effect m-t-20">Save publish</button>
        <button type="button" @click="onFormSubmit(false)" class="btn btn-raised btn-info waves-effect m-t-20">
          Save draft
        </button>
      </div>
    </div>
  </AuthorizationFallback>
</template>

<script setup>
import { ref, inject, onMounted, reactive } from 'vue'

import DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import CkUploadAdapterPlugin from '../../../../plugins/CkUploadAdapter'

import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'

import { useRoute } from 'vue-router'

import modalToast from '@/utils/modalToast'

import validation from '@/utils/validation'
import * as yup from 'yup'

import { useDropzone } from 'vue3-dropzone'

import utils from '@/utils/utils'

const { showConfirmModal, showToast } = modalToast()
const { buildMediaUrl } = utils()

const api = inject('api')

const route = useRoute()
const postId = ref(route.params.id)
const post = ref({})
const loading = ref(false)

const categories = ref([])

// Editor config
function ckUploader(editor) {
  // didn't work on es6 arrow function :'(
  // ex: const ckUploader = () => {} 
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CkUploadAdapterPlugin(loader, route.params.id)
  }
}
const editor = DocumentEditor
const editorConfig = {
  extraPlugins: [ckUploader]
}
const onEditorReady = (editor) => {
  // Insert the toolbar before the editable area.
  editor.ui
    .getEditableElement()
    .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
}

// Cover image drop zone region
const selectedImage = ref({
  name: '',
  type: '',
  url: '',
  size: 0
})
const selectImageReject = ref('')
const removeSelectedCoverImage = () => {
  selectedImage.value = {}
  selectImageReject.value = ''

  formData.value.Image = ''
}
const onCoverImageDrop = async (acceptedFiles, rejectReasons) => {
  selectImageReject.value = ''
  if (acceptedFiles.length > 0) {
    selectedImage.value.size = acceptedFiles[0].size
    selectedImage.value.type = acceptedFiles[0].type

    const resImage = await saveImageFile(acceptedFiles[0])
    if (resImage) {
      selectedImage.value.name = resImage.imgName
      selectedImage.value.url = buildMediaUrl(resImage.imgUrl)
      formData.value.Image = selectedImage.value.url
    }
  }
  if (rejectReasons.length > 0) {
    selectImageReject.value = rejectReasons[0].errors[0].message
  }
}
const options = reactive({
  multiple: false,
  onDrop: onCoverImageDrop,
  accept: ['.jpg', '.jpeg', '.png']
})
const { getRootProps: getCoverImageRootProps, getInputProps: getCoverImageInputProps } =
  useDropzone(options)
// End Cover image drop zone region

// Cover image drop zone region
const selectedMetaImage = ref({
  name: '',
  type: '',
  url: '',
  size: 0
})
const selectMetaImageReject = ref('')
const removeSelectedMetaImage = () => {
  selectedMetaImage.value = {}
  selectMetaImageReject.value = ''

  formData.value.MetaImage = ''
}
const onMetaImageDrop = async (acceptedFiles, rejectReasons) => {
  selectMetaImageReject.value = ''
  if (acceptedFiles.length > 0) {
    selectedMetaImage.value.size = acceptedFiles[0].size
    selectedMetaImage.value.type = acceptedFiles[0].type

    const resImage = await saveImageFile(acceptedFiles[0])
    if (resImage) {
      selectedMetaImage.value.name = resImage.imgName
      selectedMetaImage.value.url = buildMediaUrl(resImage.imgUrl)
      formData.value.MetaImage = selectedMetaImage.value.url
    }
  }
  if (rejectReasons.length > 0) {
    selectMetaImageReject.value = rejectReasons[0].errors[0].message
  }
}
const metaImageOtions = reactive({
  multiple: false,
  onDrop: onMetaImageDrop,
  accept: ['.jpg', '.jpeg', '.png']
})
const { getRootProps: getMetaImageRootProps, getInputProps: getMetaImageInputProps } =
  useDropzone(metaImageOtions)
// End Cover image drop zone region

// Form region
const { runYupValidation } = validation()
const errrorMessage = ref('')
const initialFormData = () => {
  return {
    Title: '',
    Slug: '',
    IsPublish: false,
    Image: '',
    Summary: '',
    Content: '',
    Tags: '',
    Meta: '',
    MetaDescription: '',
    MetaImage: '',
    MetaKeywords: '',
    MetaAuthor: '',
    CategoryId: 1
  }
}
const formData = ref(initialFormData())
const formErrors = ref({})
const formSchema = yup.object({
  Title: yup.string().required().min(2),
  Slug: yup.string()
    .required().min(2).max(250)
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid Slug format')
    .test('no-consecutive-hyphens-or-underscores', 'Slug must not contain consecutive hyphens or underscores', value => (!value.includes('--') && !value.includes('__'))),
  IsPublish: yup.boolean().required(),
  Summary: yup.string().required().min(2),
  Content: yup.string(),
  Tags: yup.string(),
  Meta: yup.string(),
  MetaDescription: yup.string(),
  MetaImage: yup.string(),
  MetaKeywords: yup.string(),
  MetaAuthor: yup.string(),
  CategoryId: yup.number().required().integer().min(0)
})
const handleFormErrors = (errorData) => {
  let errors = {}
  errorData.forEach((error) => {
    const { propertyName, errorMessage } = error

    errors[propertyName] = errorMessage
  })
  formErrors.value = errors
}
const onFormSubmit = async (isPublish = true) => {
  loading.value = true

  let data = { ...formData.value }
  const { validated, errors } = await runYupValidation(formSchema, data)
  if (!validated) {
    formErrors.value = errors
    showToast('Please check your input data...', 'error')
    return
  }
  formErrors.value = {}

  try {
    data.IsPublish = isPublish
    data.Tags = $("#tags").val()

    const res = await api.blogPost.update(postId.value, data)
    if (res.data) {
      showToast(`Article updated successfully...`)
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
// End Form region

onMounted(async () => {
  await loadCategories()
  await loadPost()
  autosize($('textarea.auto-growth'))

  formData.value = {
    Title: post.value.title,
    Slug: post.value.slug,
    IsPublish: post.value.isPublish,
    Image: post.value.image,
    Summary: post.value.summary,
    Content: post.value.content,
    Tags: post.value.tags,
    Meta: post.value.meta,
    MetaDescription: post.value.metaDescription,
    MetaImage: post.value.metaImage,
    MetaKeywords: post.value.metaKeywords,
    MetaAuthor: post.value.metaAuthor,
    CategoryId: post.value.categoryId
  }

  $("#tags").tagsinput('add', post.value.tags)
  $('.select-picker-category').selectpicker('val', post.value.categoryId)
  $('select[class^="select-picker"]').selectpicker('refresh')

  if (post.value.image) {
    selectedImage.value.url = post.value.image
    selectedImage.value.name = post.value.image.substring(post.value.image.lastIndexOf("/") + 1)
  }
  if (post.value.metaImage) {
    selectedMetaImage.value.url = post.value.metaImage
    selectedMetaImage.value.name = post.value.metaImage.substring(post.value.metaImage.lastIndexOf("/") + 1)
  }
})

const saveImageFile = async (file) => {
  try {
    const res = await api.blogPost.uploadImage(postId.value, file)
    return res.data
  } catch (err) {
    showToast(err.message, 'error')
    return null
  }
}

const loadPost = async () => {
  try {
    const res = await api.blogPost.get(postId.value)
    post.value = res.data
  } catch (err) {
    showToast(err.message, 'error')
  }
}

const loadCategories = async () => {
  try {
    var res = await api.blogCategory.deepAll()
    categories.value = [
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
.remove-selected-image {
  cursor: pointer;
}
</style>
