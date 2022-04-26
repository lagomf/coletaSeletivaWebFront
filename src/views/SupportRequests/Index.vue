<template>
    <div>
        <div class="card mb-3">
            <div v-if="!newRequest" class="card-body">
                <h4 class="mb-3">Solicitações de suporte</h4>
                
                <b-card-group deck>
                    <b-card
                        border-variant="primary"
                        
                        align="center"
                    >
                        <b-card-text>Seu endereço não é coberto pela coleta seletiva?</b-card-text>
                    </b-card>
                    <b-card
                        border-variant="primary"
                        
                        align="center"
                    >
                        <b-card-text>A coleta seletiva não passou algum dia no endereço?</b-card-text>
                    </b-card>
                    <b-card
                        border-variant="primary"
                        
                        align="center"
                    >
                        <b-card-text>Encontrou um problema nessa plataforma?</b-card-text>
                    </b-card>
                    <b-card
                        border-variant="primary"
                        
                        align="center"
                    >
                        <b-card-text>Encontrou um problema nessa plataforma?</b-card-text>
                    </b-card>
                </b-card-group>
                <div class="divider"/>
                <p>Precisa de suporte com algum assunto?</p>
                <b-button variant="primary" @click="newRequest = true">
                    <i class="pe-7s-plus"/> Nova solicitação
                </b-button>
            </div>
            <div v-if="newRequest" class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Nova solicitação
                </div>
            </div>
            <b-overlay :show="loadingNew" variant="transparent" rounded="sm">
                <div v-if="newRequest" class="card-body">
                    <form @submit.prevent="createSupportRequest">
                        <div class="card-body">
                            <b-row form>
                                <b-col md="12">
                                    <b-form-group>
                                        <Label for="inpuType">Categoria</Label>
                                        <b-form-select name="type" id="inpuType" required v-model="form.type" :options="typeOptions" :state="formErrors.type == '' ? null : false"></b-form-select>
                                        <div class="invalid-feedback d-block"> {{ formErrors.type }} </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row form>
                                <b-col md="12">
                                    <b-form-group>
                                        <Label for="inputReason">Motivo</Label>
                                        <b-form-textarea
                                            id="inputReason"
                                            v-model="form.reason"
                                            placeholder="Descreva o motivo da sua solicitação..."
                                            rows="3"
                                            max-rows="6"
                                            :state="formErrors.reason == '' ? null : false"
                                            required
                                        ></b-form-textarea>
                                        <div class="invalid-feedback d-block"> {{ formErrors.reason }} </div>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                        </div>
                        <div class="text-right d-block p-3 card-footer">
                            <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="newRequest = false">
                                Cancelar
                            </button>
                            <button class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </b-overlay>
        </div>

        <div class="card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Suas Solicitações
                </div>
            </div>
            <b-overlay :show="loadingList" variant="transparent" rounded="sm">
                <div class="card-body">
                    <div class="accordion" role="tablist" v-for="request in supportRequests" :key="request.id">
                        <b-card no-body class="mb-1">
                            <b-card-header header-tag="header" class="p-1" role="tab">
                                <b-button block v-b-toggle="`accordion-${request.id}`" :variant="request.status ? 'success' : 'info'" class="text-left pl-4">Solicitação {{request.id}} - {{toDate(request.created_at) }}</b-button>
                            </b-card-header>
                            <b-collapse :id="`accordion-${request.id}`" accordion="my-accordion" role="tabpanel">
                                <b-card-body>
                                    <b-row>
                                        <b-col>
                                            <h6 class="text-primary">Categoria</h6>
                                            <p>{{toTypeText(request.type)}}</p>
                                        </b-col>
                                        <b-col>
                                            <h6 class="text-primary">Status</h6>
                                            <p>{{ request.status ? 'Resolvido' : 'Pendente' }}</p>
                                        </b-col>
                                    </b-row>

                                    <div class="divider"/>
                                    <h6 class="text-primary">Motivo</h6>
                                    <p>{{ request.reason }}</p>

                                    <div class="divider"/>
                                    <h6 class="text-primary">Resposta</h6>
                                    <p>{{ request.response ? request.response : 'Pendente...' }}</p>
                                </b-card-body>
                            </b-collapse>
                        </b-card>
                    </div>
                    <b-pagination 
                        v-if="!loadingList"
                        v-model="page"
                        @change="handlePageChange" 
                        :total-rows="count"
                        :per-page="pageSize"
                        align="center">
                    </b-pagination>
                </div>
            </b-overlay>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    export default {
        data: () => ({
            newRequest: false,
            form: {
                type: null,
                reason: "",
            },
            formErrors: {
                type: "",
                reason: "",
            },
            typeOptions: [
                { value: null, text: 'Selecione uma categoria', disabled: true },
                { value: 1, text: 'Geral' },
                { value: 2, text: 'Categoria 1' },
                { value: 3, text: 'Categoria 2' },
                { value: 4, text: 'Categoria 3' }
            ],
            showError: false,
            errorMessage: "",
            loadingNew: false,
            page: 1,
            pageSize: 0,
            count: 0,
            loadingList: true,
            supportRequests: null
        }),
        mounted(){
            this.getSupportRequests();
        },
        methods: {
            toDate(value){
                return moment(String(value)).format('MM/DD/YYYY');
            },
            getSupportRequests(){
                let requester_id = this.$store.getters.StateUser ? this.$store.getters.StateUser.id : null;
                axios.get(`/supportRequests?requester_id=${requester_id}&page=${this.page}&f_params[orderBy][field]=id&f_params[orderBy][type]=DESC`).then(response => {
                    this.supportRequests = response.data['data'];
                    this.pageSize = response.data['per_page'];
                    this.count = response.data['total'];
                    this.loadingList = false;
                }, function(error){
                    error;
                    this.$alertify.warning('Houve um erro');
                });
            },
            async createSupportRequest(){
                this.loading = true;
                let selfVue = this;
                await axios.post(`supportRequests`, this.form).then(response => {
                    this.showError = false;
                    this.loadingNew = false;
                    this.newRequest = false;
                    this.form = {
                        type: null,
                        reason: "",
                    }
                    this.$alertify.success('Solicitação enviada com sucesso!');
                    this.loadingList = true;
                    this.getSupportRequests();
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
                            selfVue.errorMessage = "Houve um erro ao enviar sua solicitação, tente novamente mais tarde!";
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
            handlePageChange(value){
                this.page = value;
                this.getSupportRequests();
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>