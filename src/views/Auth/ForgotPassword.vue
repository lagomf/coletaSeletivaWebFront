<template>
    <div>
        <div class="h-100 bg-plum-plate bg-animation">
            <div class="d-flex h-100 justify-content-center align-items-center">
                <b-col md="6" class="mx-auto app-login-box">
                    <div class="app-logo-inverse mx-auto mb-3"/>

                    <div class="modal-dialog w-100">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="h5 modal-title">
                                    Esqueceu sua senha?
                                    <h6 class="mt-1 mb-0 opacity-8">
                                        <span>Use o formulário abaixo para recuperá-la.</span>
                                    </h6>
                                </div>
                            </div>
                            <Form @submit.prevent="submit" v-if="!showSuccess">
                                <div class="modal-body">
                                    <div>
                                        <b-row form>
                                            <b-col md="12">
                                                <b-form-group>
                                                    <Label for="inputEmail">Email</Label>
                                                    <b-form-input type="email" name="email" id="inputEmail" v-model="form.email"
                                                                    placeholder="Digite seu e-mail..."/>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </div>
                                    <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                                    <div v-if="loading" class="text-center mt-3 text-primary">
                                        <font-awesome-icon icon="spinner" spin fixedWidth size="2x"/>
                                    </div>
                                    <div class="divider"/>
                                    <h6 class="mb-0">
                                        <router-link :to="{name: 'login'}"   class="text-primary">Voltar ao início.</router-link>
                                    </h6>
                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-right">
                                        <b-button variant="primary" type="submit" size="lg" :disabled="loading">Recuperar senha</b-button>
                                    </div>
                                </div>
                            </Form>
                            <div class="modal-body" v-if="showSuccess">
                                <h6 v-if="showSuccess" id="success" class="text-success">Uma solicitação para troca de senha foi enviada para {{ form.email }}</h6>
                                <div class="divider"/>
                                <router-link :to="{name: 'login'}"   class="btn btn-primary">Voltar ao início</router-link>
                            </div>
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
  name: "ForgotPassword",
  components: {'font-awesome-icon': FontAwesomeIcon},
  data() {
    return {
      form: {
        email: "teste@gmail.com",
      },
      showError: false,
      errorMessage: "",
      showSuccess: false,
      loading: false,
    };
  },
  methods: {
    async submit() {
        
        let selfVue = this;
        this.loading = true;
        await axios.post('forgot-password', this.form).then(response => {
            selfVue.showError = false;
            selfVue.showSuccess = true;
            selfVue.loading = false;
            response;
        },function (error) {
            selfVue.loading = false;
            selfVue.showSuccess = false;
            selfVue.showError = true;
            if(error.response.data['message']){
                selfVue.errorMessage = error.response.data['message'];
            }else{
                selfVue.errorMessage = "Houve um erro ao solicitar a troca de senha, tente novamente mais tarde!";
            }
        });
        self.console.log(this.formErrors);
        // this.$router.push({name:'login'});
    },
  },
};
</script>
