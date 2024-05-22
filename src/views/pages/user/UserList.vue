<template>
  <AuthorizationFallback :permissions="['admin']">
    <div class="header">
      <h2>
        All users <small>All Users from Merchifies except <b>Customer</b></small>
      </h2>
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
            <li><a @click="showUserModal('create', 0)">Add new</a></li>
            <li><a @click="recacheUsers()">Recache all users</a></li>
          </ul>
        </li>
      </ul>
    </div>

    <div class="body table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in data" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName + ' ' + user.lastName }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="label bg-green" v-for="role in user.roles" :key="role.id">{{
                role.name
              }}</span>
            </td>
            <td>
              <span class="label bg-blue" v-if="user.enabled">Active</span>
              <span class="label bg-red" v-else>Inactive</span>
            </td>
            <td>
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
                    <li>
                      <a @click="showUserModal('update', user.id)"
                        ><i class="material-icons">mode_edit</i>
                        <span class="icon-name">Details</span></a
                      >
                    </li>
                    <li>
                      <a @click="showChangePasswordModal(user.id)"
                        ><i class="material-icons">vpn_key</i>
                        <span class="icon-name">Password</span></a
                      >
                    </li>
                    <li :v-if="user.id != 1">
                      <a @click="showDeleteUser(user.id)"
                        ><i class="material-icons">remove_circle_outline</i>
                        <span class="icon-name">Remove</span></a
                      >
                    </li>
                    <li></li>
                  </ul>
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <!-- Nút "First" -->
          <li class="page-item" :class="{ disabled: pagination.isFirstPage }">
            <button class="page-link" @click="goToPage(1)" :disabled="pagination.isFirstPage">
              First
            </button>
          </li>
          <!-- Nút "Previous" -->
          <li class="page-item" :class="{ disabled: !pagination.hasPreviousPage }">
            <button class="page-link" @click="previousPage" :disabled="!pagination.hasPreviousPage">
              Previous
            </button>
          </li>
          <!-- Danh sách số trang -->
          <li
            v-for="page in displayedPages"
            :key="page"
            class="page-item"
            :class="{ active: page === pagination.pageNumber }"
          >
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <!-- Nút "Next" -->
          <li class="page-item" :class="{ disabled: !pagination.hasNextPage }">
            <button class="page-link" @click="nextPage" :disabled="!pagination.hasNextPage">
              Next
            </button>
          </li>
          <!-- Nút "Last" -->
          <li class="page-item" :class="{ disabled: pagination.isLastPage }">
            <button
              class="page-link"
              @click="goToPage(pageCount)"
              :disabled="pagination.isLastPage"
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
      <div class="pagination-info">
        Showing from {{ pagination.firstItemOnPage }} to {{ pagination.lastItemOnPage }} of
        {{ pagination.totalItemCount }} results!
      </div>
    </div>

    <!-- User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" role="dialog" ref="userModal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{ mode == 'create' ? 'Create New User' : 'Edit User: ' + selectedUser?.userName }}
            </h4>
          </div>
          <div class="modal-body">
            <div v-if="errrorMessage != ''" class="alert alert-danger">{{ errrorMessage }}</div>
            <div class="row">
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Username</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.UserName }">
                    <input type="text" v-model="formUserData.UserName" class="form-control" :disabled="mode == 'update'" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.UserName">{{
                    formUserErrors?.UserName
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Email</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Email }">
                    <input type="text" v-model="formUserData.Email" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Email">{{
                    formUserErrors?.Email
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>First name</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.FirstName }">
                    <input type="text" v-model="formUserData.FirstName" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.FirstName">{{
                    formUserErrors?.FirstName
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Last name</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.LastName }">
                    <input type="text" v-model="formUserData.LastName" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.LastName">{{
                    formUserErrors?.LastName
                  }}</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Facebook </b><i>(ID)</i></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Facebook }">
                    <input type="text" v-model="formUserData.Facebook" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Facebook">{{
                    formUserErrors?.Facebook
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Instagram </b><i>(ID)</i></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Instagram }">
                    <input type="text" v-model="formUserData.Instagram" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Instagram">{{
                    formUserErrors?.Instagram
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Twitter </b><i>(ID)</i></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Twitter }">
                    <input type="text" v-model="formUserData.Twitter" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Twitter">{{
                    formUserErrors?.Twitter
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Youtube </b><i>(ID)</i></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Youtube }">
                    <input type="text" v-model="formUserData.Youtube" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Youtube">{{
                    formUserErrors?.Youtube
                  }}</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Gender</b></label>
                  <div :class="{ error: formUserErrors?.Gender }">
                    <select
                      v-model="formUserData.Gender"
                      class="form-control select-picker-gender show-tick"
                    >
                      <option value="true">Male</option>
                      <option value="false">FeMale</option>
                    </select>
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Gender">{{
                    formUserErrors?.Gender
                  }}</label>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Phone number</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.PhoneNumber }">
                    <input type="text" v-model="formUserData.PhoneNumber" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.PhoneNumber">{{
                    formUserErrors?.PhoneNumber
                  }}</label>
                </div>
              </div>
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Roles</b></label>
                  <div :class="{ error: formUserErrors?.RoleId }">
                    <select
                      v-model="formUserData.RoleId"
                      class="select-picker-role form-control show-tick"
                      :disabled="mode == 'update' && selectedUser?.id == 1"
                    >
                      <option v-for="role in roles" :value="role.id" :key="role.id">
                        {{ role.name }}
                      </option>
                    </select>
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.RoleId">{{
                    formUserErrors?.RoleId
                  }}</label>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="mt-0"><b>Description</b></label>
                  <div class="form-line" :class="{ error: formUserErrors?.Description }">
                    <textarea
                      v-model="formUserData.Description"
                      rows="1"
                      class="form-control no-resize auto-growth"
                    ></textarea>
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Description">{{
                    formUserErrors?.Description
                  }}</label>
                </div>
              </div>
              <div class="col-lg-6 col-md-6">
                <div class="form-group">
                  <label class="font-weight-bold mt-0">Avatar</label>
                  <div v-bind="getCoverImageRootProps()" class="dropzone dz-clickable">
                    <input v-bind="getCoverImageInputProps()" />
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
                  <label class="error text-left" v-show="formUserErrors?.AvatarFile">{{
                    formUserErrors?.AvatarFile
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="onUserSubmit" class="btn btn-link waves-effect">
              SAVE CHANGES
            </button>
            <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End User Modal -->

    <!-- Change Password Modal -->
    <div
      class="modal fade"
      id="changePasswordModal"
      tabindex="-1"
      role="dialog"
      ref="changePasswordModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Change Password for "{{ selectedUser?.userName }}"</h4>
          </div>
          <div class="modal-body">
            <div class="row clearfix">
              <div class="col-12">
                <div v-if="errrorMessage != ''" class="alert alert-danger">{{ errrorMessage }}</div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label class="mt-0"><b>Old password</b></label>
                  <div class="form-line" :class="{ error: formPwdErrors.OldPassword }">
                    <input type="password" v-model="formPwdData.OldPassword" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formPwdErrors.OldPassword">{{
                    formPwdErrors.OldPassword
                  }}</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label class="mt-0"><b>New password</b></label>
                  <div class="form-line" :class="{ error: formPwdErrors.NewPassword }">
                    <input type="password" v-model="formPwdData.NewPassword" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formPwdErrors.NewPassword">{{
                    formPwdErrors.NewPassword
                  }}</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group" :class="{ error: formPwdErrors.ConfirmPassword }">
                  <div class="form-line">
                    <label class="mt-0"><b>Confirm password</b></label>
                    <input
                      type="password"
                      id="ConfirmedPassword"
                      v-model="formPwdData.ConfirmPassword"
                      class="form-control"
                    />
                  </div>
                  <label class="error text-left" v-show="formPwdErrors.ConfirmPassword">{{
                    formPwdErrors.ConfirmPassword
                  }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="onPwdSubmit" class="btn btn-link waves-effect">
              SAVE CHANGES
            </button>
            <button type="button" class="btn btn-link waves-effect" data-dismiss="modal">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Change Password Modal -->
  </AuthorizationFallback>
</template>

<script setup>
import AuthorizationFallback from '@/components/page/AuthorizationFallback.vue'
import { ref, inject, onMounted, computed, reactive } from 'vue'
import modalToast from '@/utils/modalToast'
import validation from '@/utils/validation'
import utils from '@/utils/utils'
import { useDropzone } from 'vue3-dropzone'

import * as yup from 'yup'

const api = inject('api')
const { runYupValidation } = validation()

const { showConfirmModal, showToast } = modalToast()
const { encrypt, buildUserAvatarUrl } = utils()

const loading = ref('false')
const errrorMessage = ref('')

const data = ref([])
const queryParams = ref({ pageSize: 10, page: 1 })
const pagination = ref({ pageNumber: 0, pageCount: 0 })

const selectedUser = ref({})
const roles = ref([])
const mode = ref('create')

// Change password region
const changePasswordModal = ref(null)
const initialPwdFormData = () => {
  return {
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: ''
  }
}

const formPwdData = ref(initialPwdFormData())
const formPwdErrors = ref({})

const pwdSchema = yup.object({
  OldPassword: yup.string().required().min(6),
  NewPassword: yup.string().required().min(6)
    .notOneOf([yup.ref('OldPassword')], 'New password cannot be the same as the old password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one digit'),
  ConfirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('NewPassword')], 'Passwords do not match')
})
const handleChangPwdErrors = (errorData) => {
  let errors = {}
  errorData.forEach((error) => {
    const { propertyName, errorMessage } = error

    errors[propertyName] = errorMessage
  })
  formPwdErrors.value = errors
}
const showChangePasswordModal = (userId) => {
  resetPwdForm()
  selectUser(userId)
  $(changePasswordModal.value).modal('show')
}
const onPwdSubmit = async () => {
  loading.value = true

  let data = { ...formPwdData.value }
  const { validated, errors } = await runYupValidation(pwdSchema, data)
  if (!validated) {
    formPwdErrors.value = errors
    return
  }
  formPwdErrors.value = {}

  data.OldPassword = encrypt(data.OldPassword)
  data.ConfirmPassword = encrypt(data.ConfirmPassword)
  data.NewPassword = encrypt(data.NewPassword)

  try {
    await api.user.changePassword(selectedUser.value.id, data)
    showToast(`User "${selectedUser.value.userName}" password changed successfully...`)
    $(changePasswordModal.value).modal('hide')
  } catch (err) {
    if (err.errorData) {
      handleChangPwdErrors(err.errorData)
    } else {
      errrorMessage.value = err.message
    }
  } finally {
    loading.value = false
  }
}
const resetPwdForm = () => {
  formPwdData.value = initialPwdFormData()
  formPwdErrors.value = {}
}
// End change password region

// User detail region
const userModal = ref(null)
const initialUserFormData = () => {
  return {
    RoleId: 0,
    UserName: '',
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Description: '',
    AvatarFile: null,
    Gender: true,
    Facebook: '',
    Twitter: '',
    Instagram: '',
    Youtube: ''
  }
}

const formUserData = ref(initialUserFormData())
const formUserErrors = ref({})

const userSchema = yup.object({
  UserName: yup.string().required().min(4),
  Email: yup.string().required().email(),
  FirstName: yup.string().required().min(2),
  LastName: yup.string().required().min(2),
  Description: yup.string().min(2),
  AvatarFile: yup
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
  PhoneNumber: yup
    .string()
    .required()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  RoleId: yup.number().integer().required(),
  Gender: yup.bool().oneOf([true, false]).required()
})

// Cover image drop zone region
const selectedImage = ref({
  name: '',
  type: '',
  url: '',
  size: 0,
  file: ''
})
const selectImageReject = ref('')
const removeSelectedCoverImage = () => {
  selectedImage.value = {}
  selectImageReject.value = ''

  formUserData.value.AvatarFile = null
}
const onCoverImageDrop = async (acceptedFiles, rejectReasons) => {
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

    formUserData.value.AvatarFile = selectedImage.value.file
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

const handleUserErrors = (errorData) => {
  let errors = {}
  errorData.forEach((error) => {
    const { propertyName, errorMessage } = error

    errors[propertyName] = errorMessage
  })
  formUserErrors.value = errors
}
const showUserModal = async (mod, userId) => {
  mode.value = mod
  errrorMessage.value = ''
  
  resetUserForm()
  removeSelectedCoverImage()

  if (mod == 'create') {
    $('.select-picker-role').selectpicker('val', [])
    $('.select-picker-gender').selectpicker('val', 'true')
  }
  if (mod == 'update') {
    await selectUser(userId)
    formUserData.value = {
      RoleId: selectedUser.value.roleId,
      UserName: selectedUser.value.userName,
      Email: selectedUser.value.email,
      FirstName: selectedUser.value.firstName,
      LastName: selectedUser.value.lastName,
      PhoneNumber: selectedUser.value.phoneNumber,
      Gender: selectedUser.value.gender,
      Description: selectedUser.value.description,
      Facebook: selectedUser.value.facebook,
      Twitter: selectedUser.value.twitter,
      Instagram: selectedUser.value.instagram,
      Youtube: selectedUser.value.youtube,
      AvatarFile: null
    }

    selectedImage.value.name = selectedUser.value.avatar
    selectedImage.value.url = buildUserAvatarUrl(selectedUser.value.avatar)

    $('.select-picker-role').selectpicker('val', selectedUser.value.roleId)
    $('.select-picker-gender').selectpicker(
      'val',
      selectedUser.value.gender == true ? 'true' : 'false'
    )
  }

  $('select[class^="select-picker"]').selectpicker('refresh')
  autosize($('textarea.auto-growth'))
  $(userModal.value).modal('show')
}
const onUserSubmit = async () => {
  loading.value = true

  let data = { ...formUserData.value }
  const { validated, errors } = await runYupValidation(userSchema, data)
  if (!validated) {
    formUserErrors.value = errors
    return
  }
  formUserErrors.value = {}

  try {
    const res =
      mode.value == 'create'
        ? await api.user.add(data)
        : await api.user.update(selectedUser.value.id, data)
    if (res.data) {
      showToast(
        mode.value == 'create'
          ? `User "${data.UserName}" created successfully...`
          : `User "${data.UserName}" updated successfully...`
      )
      loadUsers(queryParams.value)
      $(userModal.value).modal('hide')
    }
  } catch (err) {
    if (err.errorData) {
      handleUserErrors(err.errorData)
    } else {
      errrorMessage.value = err.message
    }
  } finally {
    loading.value = false
  }
}
const resetUserForm = () => {
  formUserData.value = initialUserFormData()
  formUserErrors.value = {}
  selectedImage.value = {
    name: '',
    type: '',
    url: '',
    size: 0,
    file: ''
  }
}
// End user detail region

const pageCount = computed(() => {
  return pagination.value.pageCount
})

const displayedPages = computed(() => {
  const currentPage = pagination.value.pageNumber
  const lastPage = pagination.value.pageCount
  const delta = 2
  const left = currentPage - delta
  const right = currentPage + delta + 1
  const range = []
  const rangeWithDots = []

  for (let i = 1; i <= lastPage; i++) {
    if (i === 1 || i === lastPage || (i >= left && i < right)) {
      range.push(i)
    }
  }

  let l

  for (const num of range) {
    if (l) {
      if (num - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (num - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(num)
    l = num
  }
  return rangeWithDots
})

onMounted(async () => {
  await loadUsers(queryParams.value)
  await loadRoles()
  autosize($('textarea.auto-growth'))
})

const goToPage = (pageNumber) => {
  if (pagination.value.pageNumber !== pageNumber) {
    queryParams.value.page = pageNumber
    loadUsers(queryParams.value)
  }
}
const nextPage = () => {
  queryParams.value.page = pagination.value.pageNumber + 1
  loadUsers(queryParams.value)
}
const previousPage = () => {
  queryParams.value.page = pagination.value.pageNumber - 1
  loadUsers(queryParams.value)
}

const loadRoles = async () => {
  try {
    const res = await api.rolePermission.allRoles()
    roles.value = res.data
  }
  catch (err) {
    errrorMessage.value = err.message
  }
}

const showDeleteUser = (userId) => {
  showConfirmModal(null, async (confirmed) => {
    if (!confirmed) return

    try {
      await api.user.del(userId)
      showToast(`User with id "${userId}" deleted successfully...`)
    } catch (err) {
      errrorMessage.value = err.message
      showToast(err.message, 'error')
    } finally {
      loading.value = false
    }
  })
}

const recacheUsers = async () => {
  loading.value = true
  try {
    await api.user.recache()
    await loadUsers(queryParams.value)
    showToast(`All users recached successfully...`)
  } catch (err) {
    errrorMessage.value = err.message
    showToast(err.message, 'error')
  } finally {
    loading.value = false
  }
}

const loadUsers = async (queryParams) => {
  loading.value = true
  try
  {
    const res = await api.user.all(queryParams)
    data.value = res.data
    pagination.value = res.pagination
  }
  catch (err)
  {
    errrorMessage.value = err.message
    showToast(err.message, 'error')
  }
  finally
  {
    loading.value = false
  }
}

const selectUser = async (userId) => {
  loading.value = true
  try {
    const res = await api.user.get(userId)
    selectedUser.value = res.data
  } catch (err) {
    errrorMessage.value = err.message
    showToast(err.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
table li {
  list-style: none;
}

.dropzone .dz-message .drag-icon-cph .material-icons {
  font-size: unset !important;
}
</style>
