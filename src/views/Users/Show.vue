<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    {{form.name}} <b-badge pill variant="info" class="text-white">{{ userRole }}</b-badge>
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="updateUser">
                    <div class="card-body">
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputName">Nome Completo</Label>
                                    <b-form-input type="text" name="name" id="inputName" v-model="form.name" :state="formErrors.name == '' ? null : false"
                                                :readonly="!editUser" required placeholder="Digite o nome completo..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputEmail">E-mail</Label>
                                    <b-form-input type="email" name="email" id="inputEmail" v-model="form.email" :state="formErrors.email == '' ? null : false"
                                                :readonly="!editUser" required placeholder="Digite o e-mail..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.email }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <div v-if="editUser" class="divider"/>
                        <p v-if="editUser">Preencha para trocar a senha</p>
                        <b-row form v-if="editUser">
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputPassword">Senha</Label>
                                    <b-form-input type="password" name="password" id="inputPassword" v-model="form.password" :state="formErrors.password == '' ? null : false"
                                                placeholder="Digite a senha..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.password }} </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputPasswordConfirmation">Confirmar Senha</Label>
                                    <b-form-input type="password" name="password_confirmation" id="inputPasswordConfirmation" v-model="form.password_confirmation" :state="formErrors.password == '' ? null : false"
                                                placeholder="Digite a senha novamente..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.password }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <div v-if="editUser && this.hasPermission('view roles')" class="divider"/>
                        <p v-if="editUser && this.hasPermission('view roles')">Trocar cargo</p>
                        <b-row form v-if="editUser && this.hasPermission('view roles')">
                            <b-col>
                                <b-form-group>
                                    <b-form-select v-model="userRole" :options="roles" @input="updateUserRole()"></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                    </div>
                    <div class="text-right d-block p-3 card-footer">
                        <button v-if="!editUser" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="goBack()">
                            Voltar
                        </button>
                        <button v-if="!editUser && this.hasPermission('update users') && !isUser(this.$route.params.id)" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-info btn-lg text-white" type="button" @click="editUser = true">
                            Editar
                        </button>
                        <button v-if="editUser" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="editUser = false">
                            Cancelar
                        </button>
                        <button v-if="editUser" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
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
                userRole: null,
                editUser : false,
                showError: false,
                errorMessage: "",
                loading: false,
            };
        },
        created() {
            if(this.hasPermission('view roles')){
                this.getRoles();
            }
            this.getUser(this.$route.params.id);
            this.$watch(
            () => this.$route.params,
            (toParams) => {
                this.getUser(toParams.id);
            }
            )
        },
        methods: {
            isUser(id){
                return this.$store.getters.StateUser.id == id;
            },
            hasPermission(permission){
                if(this.$store.getters.StatePermissions){
                    return this.$store.getters.StatePermissions.includes(permission);
                }else{
                    return false;
                }
            },
            goBack(){
                this.$router.push({name: 'usersIndex'});
            },
            getRoles(){
                this.loading = true;
                axios.get(`/roles`).then(response => {
                    let index = 0;
                    let array = [];
                    while (index < response.data.length) {
                        array[index] = {
                            value: response.data[index].name,
                            text: response.data[index].name,
                        }
                        index++;
                    }
                    this.roles = array;
                }, function(error){
                    this.$alertify.warning('Houve um erro');
                    error;
                });
            },
            getUser(id){
                this.loading = true;
                let selfVue = this;
                axios.get(`/users/${id}?include=roles`).then(response => {
                    this.form.email = response.data['email'];
                    this.form.name = response.data['name'];
                    this.userRole = response.data['roles'][0] ? response.data['roles'][0]['name'] : 'Sem cargo';
                    this.loading = false;
                }, function(error){
                    if(error.response.status == 404){
                        selfVue.$router.push({
                            name: 'NotFound',
                            // preserve current path and remove the first char to avoid the target URL starting with `//`
                            params: { pathMatch: selfVue.$route.path.substring(1).split('/') },
                            // preserve existing query and hash if any
                            query: selfVue.$route.query,
                            hash: selfVue.$route.hash,
                        });
                    }else{
                        this.$alertify.warning('Houve um erro');
                    }
                });
            },
            async updateUser(){
                this.loading = true;
                let selfVue = this;
                let form = {};
                if(this.form.password || this.form.password_confirmation){
                    form = this.form;
                }else{
                    form = {
                        email: this.form.email,
                        name : this.form.name,
                    }
                }
                await axios.patch(`users/${this.$route.params.id}`, form).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.editUser = false;
                    this.form.password = "";
                    this.form.password_confirmation = "";
                    this.$alertify.success('Usuário atualizado com sucesso!');
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
                            selfVue.errorMessage = "Houve um erro ao editar o usuário, tente novamente mais tarde!";
                        }
                    }
                });
            },
            async updateUserRole(){
                this.loading = true;
                let selfVue = this;
                let form = {
                    role: this.userRole
                }
                await axios.patch(`users/${this.$route.params.id}/role`, form).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.$alertify.success('Cargo atualizado com sucesso!');
                    response;
                },function (error) {
                    selfVue.loading = false;
                    selfVue.showError = true;
                    if(error.response.data['message']){
                        selfVue.errorMessage = error.response.data['message'];
                    }else{
                        selfVue.errorMessage = "Houve um erro ao atualizar o cargo, tente novamente mais tarde!";
                    }
                    
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>