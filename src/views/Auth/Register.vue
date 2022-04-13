<template>
    <div>
        <div class="h-100 bg-premium-dark">
            <div class="d-flex h-100 justify-content-center align-items-center">
                <b-col md="8" class="mx-auto app-login-box">
                    <div class="app-logo-inverse mx-auto mb-3"/>

                    <div class="modal-dialog w-100">
                        <div class="modal-content">
                            <form @submit.prevent="submit">
                                <div class="modal-body">
                                    <h5 class="modal-title">
                                        <h4 class="mt-2">
                                            <div>Bem vindo(a),</div>
                                            <span>Cadastre-se para poder acompanhar as útimas informações sobre a <span class="text-success">Coleta Seletiva</span> de Toledo.</span>
                                        </h4>
                                    </h5>
                                    <div class="divider"/>
                                    <b-form-group id="emailInputGroup"
                                                label-for="emailInput"
                                                description="Nunca compartilharemos seu e-mail com terceiros.">
                                        <b-form-input id="emailInput"
                                                    type="email"
                                                    v-model="form.email"
                                                    required
                                                    placeholder="Digite seu e-mail...">
                                        </b-form-input>
                                        <div class="invalid-feedback d-block"> {{ formErrors.email }} </div>
                                    </b-form-group>
                                    <b-form-group id="nameInputGroup"
                                                label-for="nameInput">
                                        <b-form-input id="nameInput"
                                                    type="text"
                                                    v-model="form.name"
                                                    required
                                                    placeholder="Digite com seu nome completo...">
                                        </b-form-input>
                                        <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                    </b-form-group>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-group id="passwordInputGroup"
                                                        label-for="passwordInput">
                                                <b-form-input id="passwordInput"
                                                            type="password"
                                                            v-model="form.password"
                                                            required
                                                            minlength="6"
                                                            placeholder="Digite uma senha...">
                                                </b-form-input>
                                                <div class="invalid-feedback d-block"> {{ formErrors.password }} </div>
                                            </b-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <b-form-group id="passwordConfirmationInputGroup"
                                                        label-for="passwordConfirmationInput">
                                                <b-form-input id="passwordConfirmationInput"
                                                            type="password"
                                                            v-model="form.password_confirmation"
                                                            required
                                                            minlength="6"
                                                            placeholder="Repita a senha...">
                                                </b-form-input>
                                            </b-form-group>
                                        </div>
                                    </div>
                                    <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                                    <p v-if="showSuccess" id="success" class="text-success">{{ form.name }} cadastrado(a) com sucesso!</p>
                                    <div class="divider"/>
                                    <h6 class="mb-0">
                                        Já tem uma conta?
                                        <router-link :to="{name: 'login'}"   class="text-primary">Entre aqui</router-link>
                                        |
                                        <router-link :to="{name: 'recover-password'}"   class="text-secondary">Esqueci minha senha</router-link>
                                    </h6>
                                    <div v-if="loading" class="text-center mt-3 text-primary">
                                        <font-awesome-icon icon="spinner" spin fixedWidth size="2x"/>
                                    </div>
                                </div>
                                <div class="modal-footer d-block text-center">
                                    <b-button color="primary" type="submit" class="btn-wide btn-pill btn-shadow btn-hover-shine" :disabled="loading"
                                            size="lg">Criar conta
                                    </b-button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="text-center text-white opacity-8 mt-3">
                        Toledo - Paraná
                    </div>
                </b-col>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {
    faSpinner
  } from '@fortawesome/free-solid-svg-icons'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
library.add(
    faSpinner,
  );
export default {
  name: "Register",
  components: {'font-awesome-icon': FontAwesomeIcon},
  data() {
    return {
      form: {
        email: "teste@gmail.com",
        name: "Matheus Lago Frete",
        password: "asfasjf",
        password_confirmation: "asfasfiasf",
      },
      formErrors: {
        email: "",
        name: "",
        password: ""
      },
      showError: false,
      errorMessage: "",
      showSuccess: false,
      loading: false,
    };
  },
  methods: {
    async submit() {
        this.formErrors = {
            email: "",
            name: "",
            password: ""
        }
        let selfVue = this;
        this.loading = true;
        await axios.post('register', this.form).then(response => {
            selfVue.loading = false;
            selfVue.showError = false;
            selfVue.showSuccess = true;
            response;
        },function (error) {
            selfVue.loading = false;
            selfVue.showSuccess = false;
            selfVue.showError = true;
            if(error.response.status == 422){
                selfVue.errorMessage = "Revise os dados inseridos!";
                if(error.response.data['errors']){
                    let errors = error.response.data['errors'];
                    for(var property in errors){
                        selfVue.formErrors[property] = errors[property][0];
                    }
                }
            }else{
                selfVue.errorMessage = "Houve um erro ao realizar seu cadastro, tente novamente mais tarde!";
            }
        });
        // this.$router.push({name:'login'});
    },
  },
};
</script>
