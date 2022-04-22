<template>
    <div>
        <div class="h-100 bg-plum-plate bg-animation">
            <div class="d-flex h-100 justify-content-center align-items-center">
                <b-col md="8" class="mx-auto app-login-box">
                    <div class="app-logo-inverse mx-auto mb-3"/>

                    <div class="modal-dialog w-100 mx-auto">
                        <div class="modal-content">
                            <form @submit.prevent="submit">
                                <div class="modal-body">
                                    <div class="h5 modal-title text-center">
                                        <h4 class="mt-2">
                                            <div>Bem vindo(a) de volta,</div>
                                            <span>Por favor, entre com a sua conta abaixo.</span>
                                        </h4>
                                    </div>
                                    <b-form-group id="emailInputGroup"
                                                label-for="emailInput"
                                                description="Nunca compartilharemos seu e-mail com terceiros.">
                                        <b-form-input id="emailInput"
                                                    type="email"
                                                    required
                                                    name="email"
                                                    v-model="form.email"
                                                    placeholder="Digite seu e-mail...">
                                        </b-form-input>
                                    </b-form-group>
                                    <b-form-group id="passwordInputGroup"
                                                label-for="passwordInput">
                                        <b-form-input id="passwordInput"
                                                    type="password"
                                                    required
                                                    name="password"
                                                    v-model="form.password"
                                                    placeholder="Digite sua senha...">
                                        </b-form-input>
                                    </b-form-group>
                                    <div class="divider"/>
                                    <p v-if="showError" id="error" class="text-danger">Email ou senha incorretos.</p>
                                    <h6 class="mb-0">
                                        Não tem conta?
                                        <router-link :to="{name: 'register'}" class="text-primary">Cadastre-se agora!</router-link>
                                    </h6>
                                </div>
                                <div class="modal-footer clearfix">
                                    <div class="float-left">
                                        <router-link :to="{name: 'recover-password'}" class="text-secondary">Esqueci minha senha</router-link>
                                    </div>
                                    <div class="float-right">
                                        <b-button variant="primary" type="submit" size="lg">Login</b-button>
                                    </div>
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
import { mapActions } from "vuex";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      form: {
        email: "mlfrete@gmail.com",
        password: "root",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
        const User = new FormData();
        User.append("email", this.form.email);
        User.append("password", this.form.password);
        try {
            await this.LogIn(User);
            this.$router.push({name:"home"});
            this.showError = false
        } catch (error) {
            this.showError = true
        }
    },
  },
};
</script>
