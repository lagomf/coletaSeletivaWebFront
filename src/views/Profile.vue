<template>
    <div>
        <div class="mb-3 card" v-if="!changePassword">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Minha Conta
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="updateProfile">
                    <div class="no-gutters row">
                        <div class="card-body">
                            <b-row form>
                                <b-col md="12">
                                    <b-form-group>
                                        <Label for="inputName">Nome Completo</Label>
                                        <b-form-input type="text" name="name" id="inputName" v-model="formProfile.name" :state="formProfileErrors.name == '' ? null : false"
                                                    :readonly="!editProfile" required placeholder="Digite seu nome completo..."/>
                                        <div class="invalid-feedback d-block"> {{ formProfileErrors.name }} </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row form>
                                <b-col :md="changedEmail && editProfile ? 6 : 12">
                                    <b-form-group>
                                        <Label for="inputEmail">E-mail</Label>
                                        <b-form-input type="email" name="email" id="inputEmail" v-model="formProfile.email" :state="formProfileErrors.email == '' ? null : false"
                                                    :readonly="!editProfile" required placeholder="Digite seu e-mail..."/>
                                        <div class="invalid-feedback d-block"> {{ formProfileErrors.email }} </div>
                                    </b-form-group>
                                </b-col>
                                <b-col v-if="changedEmail && editProfile" md="6">
                                    <b-form-group>
                                        <Label for="inputEmailConfirmation">Confirmação do E-mail</Label>
                                        <b-form-input type="email" name="email_confirmation" id="inputEmailConfirmation" v-model="formProfile.email_confirmation" :state="formProfileErrors.email == '' ? null : false"
                                                    :readonly="!editProfile" required placeholder="Repita o novo e-mail..."/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                        </div>
                    </div>
                
                    <div class="text-right d-block p-3 card-footer">
                        <button v-if="!editProfile" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="changePassword = true">
                            Trocar senha
                        </button>
                        <button v-if="!editProfile" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-info btn-lg text-white" type="button" @click="editProfile = true">
                            Editar perfil
                        </button>
                        <button v-if="editProfile" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="editProfile = false">
                            Cancelar
                        </button>
                        <button v-if="editProfile" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                            Salvar
                        </button>
                    </div>
                </form>
            </b-overlay>
        </div>
        <div v-if="changePassword" class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Trocar Senha
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="updatePassword">
                    <div class="no-gutters row">
                        <div class="card-body">
                            <b-row form>
                                <b-col md="6" sm="12">
                                    <b-form-group>
                                        <Label for="inputPassword">Nova senha</Label>
                                        <b-form-input type="password" name="password" id="inputPassword" v-model="formPassword.password" :state="formPasswordErrors.password == '' ? null : false"
                                                    required placeholder="Digite a nova senha..."/>
                                        <div class="invalid-feedback d-block"> {{ formPasswordErrors.password }} </div>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6" sm="12">
                                    <b-form-group>
                                        <Label for="inputPasswordConfirmation">Confirmar senha</Label>
                                        <b-form-input type="password" name="password_confirmation" id="inputPasswordConfirmation" v-model="formPassword.password_confirmation" :state="formPasswordErrors.password == '' ? null : false"
                                                    required placeholder="Repita a nova senha..."/>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                        </div>
                    </div>
                    <div class="text-right d-block p-3 card-footer">
                        <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="changePassword = false">
                            Cancelar
                        </button>
                        <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                            Trocar senha
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
        components: {

        },
        data() {
            return {
                formProfile: {
                    email: "",
                    email_confirmation: "",
                    name : "",
                },
                formProfileErrors: {
                    email: "",
                    name: ""
                },
                editProfile : false,
                changePassword: false,
                formPassword: {
                    password: "",
                    password_confirmation: "",
                },
                formPasswordErrors: {
                    password: "",
                },
                showError: false,
                errorMessage: "",
                loading: false,
            };
        },

        mounted() {
            this.formProfile.email = this.$store.getters.StateUser ? this.$store.getters.StateUser.email : null;
            this.formProfile.name = this.$store.getters.StateUser ? this.$store.getters.StateUser.name : null;
        },

        computed: {
            changedEmail(){
                if(this.$store.getters.StateUser){
                    return this.formProfile.email != this.$store.getters.StateUser.email;
                }
                return false;
            }
        },

        methods: {
            async updateProfile(){
                this.loading = true;
                let selfVue = this;
                if(!this.changedEmail){
                    this.formProfile.email_confirmation = this.formProfile.email;
                }
                await axios.patch('profile', this.formProfile).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.$store.commit('setUser',response.data);
                    this.editProfile = false;
                    this.$alertify.success('Perfil atualizado com sucesso!');
                },function (error) {
                    selfVue.loading = false;
                    selfVue.showError = true;
                    if(error.response.status == 422){
                        selfVue.errorMessage = "Revise os dados inseridos!";
                        if(error.response.data['errors']){
                            let errors = error.response.data['errors'];
                            for(var property in errors){
                                selfVue.formProfileErrors[property] = errors[property][0];
                            }
                        }
                    }else{
                        if(error.response.data['message']){
                            selfVue.errorMessage = error.response.data['message'];
                        }else{
                            selfVue.errorMessage = "Houve um erro ao salvar o perfil, tente novamente mais tarde!";
                        }
                    }
                });
                this.formProfile.email_confirmation = "";
            },
            async updatePassword(){
                this.loading = true;
                let selfVue = this;
                await axios.patch('profile/password', this.formPassword).then(response => {
                    selfVue.showError = false;
                    selfVue.loading = false;
                    this.changePassword = false;
                    response;
                    this.formPassword = {
                        password: "",
                        password_confirmation: "",
                    },
                    this.$alertify.success('Senha trocada com sucesso!');
                },function (error) {
                    selfVue.loading = false;
                    selfVue.showError = true;
                    if(error.response.status == 422){
                        selfVue.errorMessage = "Revise os dados inseridos!";
                        if(error.response.data['errors']){
                            let errors = error.response.data['errors'];
                            for(var property in errors){
                                selfVue.formPasswordErrors[property] = errors[property][0];
                            }
                        }
                    }else{
                        if(error.response.data['message']){
                            selfVue.errorMessage = error.response.data['message'];
                        }else{
                            selfVue.errorMessage = "Houve um erro ao trocar a senha, tente novamente mais tarde!";
                        }
                    }
                });
            }
        },

    }


</script>
