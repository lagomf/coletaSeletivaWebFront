<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Autor: 
                    <span v-if="supportRequest.requester">
                        <span v-if="hasPermission('show users')">
                            <router-link v-if="hasPermission('show users')" :to="{name:'usersShow',params:{id:supportRequest.requester.id}}">{{supportRequest.requester.name}}</router-link>
                        </span>
                        <span v-else>
                            {{supportRequest.requester.name}}
                        </span>
                    </span>
                    <span v-else>
                        ---
                    </span>
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="updateSupportRequest">
                    <div class="card-body">
                        <b-row>
                            <b-col>
                                <h6 class="text-primary">Categoria</h6>
                                <p>{{toTypeText(supportRequest.type)}}</p>
                            </b-col>
                            <b-col>
                                <h6 class="text-primary">Status</h6>
                                <p>{{ supportRequest.status ? 'Resolvido' : 'Pendente' }}</p>
                            </b-col>
                        </b-row>

                        <div class="divider"/>

                        <b-row>
                            <b-col>
                                <h6 class="text-primary">Motivo</h6>
                                <p>{{ supportRequest.reason }}</p>
                            </b-col>
                        </b-row>

                        <div class="divider"/>

                        <b-row>
                            <b-col>
                                <h6 class="text-primary">Resposta</h6>
                                <div v-if="hasResponse">
                                    <b-form-textarea
                                            id="inputResponse"
                                            v-model="form.response"
                                            :readonly="!editSupportRequest"
                                            placeholder="Descreva a resposta para a solicitação..."
                                            rows="3"
                                            max-rows="6"
                                            :state="formErrors.response == '' ? null : false"
                                            required
                                        ></b-form-textarea>
                                        <div class="invalid-feedback d-block"> {{ formErrors.response }} </div>
                                    <p>Responsável: {{ this.supportRequest.responder ? this.supportRequest.responder.name : '----' }}</p>
                                </div>
                                <div v-else>
                                    <div v-if="hasPermission('respond supportRequests')">
                                        <div v-if="!respondingSupportRequest">
                                            <button class="btn btn-secondary" type="button" @click="respondingSupportRequest = true">Responder</button>
                                        </div>
                                        <div v-else>
                                            <b-form-textarea
                                                id="inputResponse"
                                                v-model="form.response"
                                                placeholder="Descreva a resposta para a solicitação..."
                                                rows="3"
                                                max-rows="6"
                                                :state="formErrors.response == '' ? null : false"
                                                required
                                            ></b-form-textarea>
                                            <div class="invalid-feedback d-block"> {{ formErrors.response }} </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <p> Pendente... </p>
                                    </div>
                                </div>
                                <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                            </b-col>
                        </b-row>
                    </div>
                    <div class="text-right d-block p-3 card-footer">
                        <button v-if="!editSupportRequest && !respondingSupportRequest" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="goBack()">
                            Voltar
                        </button>
                        <button v-if="hasResponse && !editSupportRequest && this.hasPermission('update supportRequests')" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-info btn-lg text-white" type="button" @click="editSupportRequest = true">
                            Editar
                        </button>
                        <button v-if="editSupportRequest" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="editSupportRequest = false">
                            Cancelar
                        </button>
                        <button v-if="editSupportRequest" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                            Salvar
                        </button>
                        <button v-if="respondingSupportRequest" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="respondingSupportRequest = false">
                            Cancelar
                        </button>
                        <button v-if="respondingSupportRequest" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                            Enviar
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
                    response: "",
                },
                formErrors: {
                    response: "",
                },
                supportRequest: {
                    id: null,
                    type: null,
                    status: null,
                    reason: null,
                    response: null,
                    requester: null,
                    responder: null,
                },
                respondingSupportRequest: false,
                editSupportRequest : false,
                showError: false,
                errorMessage: "",
                loading: false,
            };
        },
        created() {
            this.getSupportRequest(this.$route.params.id);
            this.$watch(
            () => this.$route.params,
            (toParams) => {
                this.getSupportRequest(toParams.id);
            }
            )
        },
        computed: {
            hasResponse(){
                return this.supportRequest.response ? true : false;
            }
        },
        methods: {
            hasPermission(permission){
                if(this.$store.getters.StatePermissions){
                    return this.$store.getters.StatePermissions.includes(permission);
                }else{
                    return false;
                }
            },
            goBack(){
                this.$router.push({name: 'supportRequestsIndexManager'});
            },
            getSupportRequest(id){
                this.loading = true;
                let selfVue = this;
                axios.get(`/supportRequests/${id}?include=requester,responder`).then(response => {
                    this.supportRequest.id = response.data['id'];
                    this.supportRequest.type = response.data['type'];
                    this.supportRequest.status = response.data['status'];
                    this.supportRequest.reason = response.data['reason'];
                    this.supportRequest.response = response.data['response'];
                    this.supportRequest.requester = response.data['requester'];
                    this.supportRequest.responder = response.data['responder'];

                    this.form.response = this.supportRequest.response;
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
                        selfVue.$alertify.warning('Houve um erro');
                    }
                });
            },
            updateSupportRequest(){
                if(this.editSupportRequest){
                    this.changeSupportRequest();
                }else{
                    if(this.respondingSupportRequest){
                        this.respondSupportRequest();
                    }
                }
            },
            async changeSupportRequest(){
                this.loading = true;
                let selfVue = this;
                await axios.patch(`supportRequests/${this.$route.params.id}`, this.form).then(response => {
                    this.showError = false;
                    this.editSupportRequest = false;
                    this.$alertify.success('Solicitação de suporte atualizada com sucesso!');
                    response;
                    this.getSupportRequest(this.supportRequest.id);
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
                            selfVue.errorMessage = "Houve um erro ao editar a solicitação de suporte, tente novamente mais tarde!";
                        }
                    }
                });
            },
            async respondSupportRequest(){
                this.loading = true;
                let selfVue = this;
                await axios.post(`supportRequests/${this.$route.params.id}/respond`, this.form).then(response => {
                    this.showError = false;
                    this.respondingSupportRequest = false;
                    this.$alertify.success('Solicitação de suporte respondida com sucesso!');
                    response;
                    this.getSupportRequest(this.supportRequest.id);
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
                            selfVue.errorMessage = "Houve um erro ao responder a solicitação de suporte, tente novamente mais tarde!";
                        }
                    }
                });
            },
            toTypeText(value){
                switch(value){
                    case 1:
                        return 'Geral';
                    case 2:
                        return 'Categoria 1';
                    case 3:
                        return 'Categoria 2';
                    case 4:
                        return 'Categoria 3';
                    default:
                        return 'Indefinido';
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>