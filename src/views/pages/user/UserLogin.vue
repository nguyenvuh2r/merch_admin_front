<template>
  <div>
    <div class="authentication">
      <div class="card">
        <div class="body">
          <div class="row">
            <div class="col-lg-12">
              <div class="header slideDown">
                <div class="logo"><img src="/assets/images/v-logo.png" width="250" height="50" alt="Merchifies">
                </div>
                <ul class="list-unstyled l-social">
                  <li><a href="javascript:void(0);"><i class="zmdi zmdi-facebook-box"></i></a></li>
                  <li><a href="javascript:void(0);"><i class="zmdi zmdi-linkedin-box"></i></a></li>
                  <li><a href="javascript:void(0);"><i class="zmdi zmdi-twitter"></i></a></li>
                </ul>
              </div>
            </div>
            <form class="col-lg-12" @submit.prevent="login">
              <h5 class="title">Sign in to your Account</h5>
              <div v-if="errrorMessage != ''" class="alert alert-danger">{{ errrorMessage }}</div>
              <div class="form-group form-float">
                <div class="form-line" :class="{ 'error': errors.UserName }">
                  <input type="text" v-model="UserName" v-bind="UserNameAttrs" auto-complete="off" class="form-control">
                  <label class="form-label">UserName</label>
                </div>
                <label class="error text-left" v-show="errors.UserName">{{ errors.UserName }}</label>
              </div>
              <div class="form-group form-float">
                <div class="form-line" :class="{ 'error': errors.Password }">
                  <input type="Password" v-model="Password" v-bind="PasswordAttrs" class="form-control">
                  <label class="form-label">Password</label>
                </div>
                <label class="error text-left" v-show="errors.Password">{{ errors.Password }}</label>
              </div>
              <div>
                <input type="checkbox" name="rememberme" id="rememberme" class="filled-in chk-col-cyan">
                <label for="rememberme">Remember Me</label>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <button type="submit" :disabled="!formMeta.valid" :loading="loading"
                    class="btn btn-raised btn-primary waves-effect">SIGN IN</button>
                  <a href="sign-up.html" class="btn btn-raised btn-default waves-effect">SIGN
                    UP</a>
                </div>
                <div class="col-lg-12 m-t-20">
                  <a class="" href="forgot-Password.html">Forgot Password?</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useForm } from 'vee-validate';
import router from '@/router';
import * as auth from '@/utils/auth'
import * as yup from 'yup'

const api = inject('api')

const loading = ref('false')
const errrorMessage = ref('')

const { meta: formMeta, values, errors, defineField } = useForm({
  validationSchema: yup.object({
    UserName: yup.string().required(),
    Password: yup.string().required(),
  }),
})

const [UserName, UserNameAttrs] = defineField('UserName', {
  validateOnModelUpdate: false,
})
const [Password, PasswordAttrs] = defineField('Password', {
  validateOnModelUpdate: false,
})

function login() {
  loading.value = true
  api.auth.login(values)
    .then(res => {  // Call the login API
      // Save login information
      auth.login(res.data.token, res.data.user)

      // Redirect to the homepage upon successful login
      router.go('/')
    })
    .catch(err => {
      errrorMessage.value = err.message
    })
    .finally(() => loading.value = false)
}
</script>

<style lang="scss" scoped>
.authentication {
  height: 100vh;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  text-align: center;
}

.authentication .card {
  max-width: 350px;
  margin-top: 100px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  display: inline-block;
}

.authentication .card .header {
  margin-top: -70px;
  color: #16191a;
  margin-bottom: 20px;
  box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56),
    0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}

.authentication .card .header h1 {
  font-size: 22px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.authentication .card .title {
  margin: 0;
  margin-bottom: 15px;
}

.authentication .card .msg {
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
}

.authentication .l-social {
  margin: 0;
}

.authentication .l-social li {
  display: inline-block;
}

.authentication .l-social li a {
  text-align: center;
  padding: 5px 10px;
  color: #666;
}

@media only screen and (min-width: 992px) and (max-width: 1024px) {
  .authentication .card {
    margin-top: 100px;
  }
}

@media only screen and (max-width: 767px) {
  .authentication .card {
    margin-top: 100px;
  }
}
</style>
