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
                    <li>
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
                  <label class="mt-0">Username</label>
                  <div class="form-line" :class="{ error: formUserErrors?.Username }">
                    <input type="text" v-model="formUserData.Username" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.Username">{{
                    formUserErrors?.Username
                  }}</label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6">
                <div class="form-group">
                  <label class="mt-0">Email</label>
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
                  <label class="mt-0">First name</label>
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
                  <label class="mt-0">Last name</label>
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
              <div class="col-lg-4 col-md-6">
                <div class="form-group">
                  <label class="mt-0">Gender</label>
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
                  <label class="mt-0">Mobile phone</label>
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
                  <label class="mt-0">Roles</label>
                  <div :class="{ error: formUserErrors?.RoleIds }">
                    <select
                      v-model="formUserData.RoleIds"
                      class="select-picker-role form-control show-tick"
                      multiple
                    >
                      <option v-for="role in roles" :value="role.id" :key="role.id">
                        {{ role.name }}
                      </option>
                    </select>
                  </div>
                  <label class="error text-left" v-show="formUserErrors?.RoleIds">{{
                    formUserErrors?.RoleIds
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
                  <label class="mt-0">Old password</label>
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
                  <label class="mt-0">New password</label>
                  <div class="form-line" :class="{ error: formPwdErrors.NewPassword }">
                    <input type="password" v-model="formPwdData.NewPassword" class="form-control" />
                  </div>
                  <label class="error text-left" v-show="formPwdErrors.NewPassword">{{
                    formPwdErrors.NewPassword
                  }}</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group" :class="{ error: formPwdErrors.ConfirmedPassword }">
                  <div class="form-line">
                    <label class="mt-0">Confirmed password</label>
                    <input
                      type="password"
                      id="ConfirmedPassword"
                      v-model="formPwdData.ConfirmedPassword"
                      class="form-control"
                    />
                  </div>
                  <label class="error text-left" v-show="formPwdErrors.ConfirmedPassword">{{
                    formPwdErrors.ConfirmedPassword
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
import { ref, inject, onBeforeMount, computed } from 'vue'
import modalToast from '@/utils/modalToast'
import validation from '@/utils/validation'
import * as yup from 'yup'

const api = inject('api')
const { runYupValidation } = validation()

const { showConfirmModal, showToast } = modalToast()

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
    ConfirmedPassword: ''
  }
}

const formPwdData = ref(initialPwdFormData())
const formPwdErrors = ref({})

const pwdSchema = yup.object({
  OldPassword: yup.string().required().min(6),
  NewPassword: yup.string().required().min(6),
  ConfirmedPassword: yup
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
  formUserErrors.value = errors
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

  try {
    await api.user.changePassword(selectedUser.value.id, data)
    showToast(`User "${selectedUser.value.Username}" password changed successfully...`)
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
    RoleIds: [],
    Username: '',
    Email: '',
    FirstName: '',
    LastName: '',
    PhoneNumber: '',
    Gender: true
  }
}

const formUserData = ref(initialUserFormData())
const formUserErrors = ref({})

const userSchema = yup.object({
  Username: yup.string().required().min(6),
  Email: yup.string().required().email(),
  FirstName: yup.string().required().min(2),
  LastName: yup.string().required().min(2),
  PhoneNumber: yup
    .string()
    .required()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  RoleIds: yup.array().min(1, 'Please select as least one role!'),
  Gender: yup.bool().oneOf([true, false]).required()
})
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
  if (mod == 'create') {
    $('.select-picker-role').selectpicker('val', [])
    $('.select-picker-gender').selectpicker('val', 'true')
  }
  if (mod == 'update') {
    await selectUser(userId)
    formUserData.value = {
      RoleIds: selectedUser.value.roleIds,
      Username: selectedUser.value.userName,
      Email: selectedUser.value.email,
      FirstName: selectedUser.value.firstName,
      LastName: selectedUser.value.lastName,
      PhoneNumber: selectedUser.value.phoneNumber,
      Gender: selectedUser.value.gender
    }
    $('.select-picker-role').selectpicker('val', selectedUser.value.roleIds)
    $('.select-picker-gender').selectpicker(
      'val',
      selectedUser.value.gender == true ? 'true' : 'false'
    )
  }

  $('select[class^="select-picker"]').selectpicker('refresh')
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
          ? `User "${data.Username}" created successfully...`
          : `User "${data.Username}" updated successfully...`
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

onBeforeMount(() => {
  loadUsers(queryParams.value)
  loadRoles()
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
  await api.rolePermission
    .allRoles()
    .then((res) => {
      roles.value = res.data
    })
    .catch((err) => {
      errrorMessage.value = err.message
    })
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
  await api.user
    .all(queryParams)
    .then((res) => {
      data.value = res.data
      pagination.value = res.pagination
    })
    .catch((err) => {
      errrorMessage.value = err.message
      showToast(err.message, 'error')
    })
    .finally(() => (loading.value = false))
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
</style>
