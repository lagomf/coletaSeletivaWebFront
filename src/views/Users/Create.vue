<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Criar Usuário
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="createUser">
                    <div class="card-body">
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputName">Nome Completo</Label>
                                    <b-form-input type="text" name="name" id="inputName" v-model="form.name" :state="formErrors.name == '' ? null : false"
                                                required placeholder="Digite o nome completo..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputEmail">E-mail</Label>
                                    <b-form-input type="email" name="email" id="inputEmail" v-model="form.email" :state="formErrors.email == '' ? null : false"
                                                required placeholder="Digite o e-mail..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.email }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputPassword">Senha</Label>
                                    <b-form-input type="password" name="password" id="inputPassword" v-model="form.password" :state="formErrors.password == '' ? null : false"
                                                required placeholder="Digite a senha..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.password }} </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputPasswordConfirmation">Confirmar Senha</Label>
                                    <b-form-input type="password" name="password_confirmation" id="inputPasswordConfirmation" v-model="form.password_confirmation" :state="formErrors.password == '' ? null : false"
                                                required placeholder="Digite a senha novamente..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.password }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                    </div>
                    <div class="text-right d-block p-3 card-footer">
                        <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="goBack()">
                            Voltar
                        </button>
                        <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                            Salvar
                        </button>
                    </div>
                </form>
            </b-overlay>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                form: {
                    email: "",
                    name : "",
                    password: "",
                    password_confirmation: "",
                },
                formErrors: {
                    email: "",
                    name: "",
                    password: "",
                },
                showError: false,
                errorMessage: "",
                loading: false,
            };
        },
        methods: {
            goBack(){
                this.$router.push({name: 'usersIndex'});
            },
            async createUser(){
                this.loading = true;
                let selfVue = this;
                await axios.post(`users`, this.form).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.editProfile = false;
                    this.form = {
                        email: "",
                        name : "",
                        password: "",
                        password_confirmation: "",
                    };
                    this.$alertify.success('Usuário criado com sucesso!');
                    response;
                },function (error) {
                    selfVue.loading = false;
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
                        if(error.response.data['message']){
                            selfVue.errorMessage = error.response.data['message'];
                        }else{
                            selfVue.errorMessage = "Houve um erro ao criar o usuário, tente novamente mais tarde!";
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>