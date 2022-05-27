<template>
    <div>
        <page-title 
            :heading="heading" 
            :subheading="subheading" 
            :icon="icon">
            </page-title>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Solicitações de Suporte
                </div>
            </div>
            
            <div class="card-body">
                <b-skeleton-table
                    :rows="6"
                    :columns="5"
                    animation="fade"
                    :table-props="{ bordered: true, striped: true }"
                    v-if="loading"
                ></b-skeleton-table>
                <div v-if="!loading">
                    <b-table responsive striped hover :items="vehicles" :fields="fields">
                        <template #cell(status)="row">
                            <b-badge v-if="row.value" pill variant="success" class="text-white">Concluído</b-badge>
                            <b-badge v-if="!row.value" pill variant="warning" class="text-white">Pendente</b-badge>
                        </template>
                        <template #cell(actions)="row">
                            <router-link v-if="hasPermission('view supportRequests')" :to="{name:'supportRequestsShow',params:{id:row.item.id}}" class="btn btn-info mr-1 p-1"><i class="pe-7s-info text-white"></i></router-link>
                            <b-button v-if="hasPermission('delete vehicles')" @click="deleteSupportRequest(row.item)" class="mr-1 p-1">
                                <i class="pe-7s-trash text-white"></i>
                            </b-button>
                        </template>
                    </b-table>
                    <b-pagination 
                        v-model="page"
                        @change="handlePageChange" 
                        :total-rows="count"
                        :per-page="pageSize"
                        align="center">
                    </b-pagination>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    import PageTitle from "../../Layout/Components/PageTitle.vue";
    import axios from 'axios';
    import moment from 'moment'
    export default {
        components: {
            PageTitle,
        },
        data: () => ({
            heading: 'Gerenciar solicitações de suporte',
            subheading: 'Pesquisar, responder, editar e deletar solicitações de suporte.',
            icon: 'pe-7s-help2 icon-gradient bg-tempting-azure',

            supportRequests : {

            },
            pageSize: "",
            count: "",
            page: 1,
            loading: true,
            fields: [
                {
                    'key':'id',
                    'label':'ID',
                },
                {
                    'key':'type',
                    'label':'Categoria',
                    formatter: (value) => {
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
                    }
                },
                {
                    'key':'requester',
                    'label':'Solicitante',
                    formatter: (value) => {
                        return value.name;
                    }
                },
                {
                    'key':'responder',
                    'label':'Responsável',
                    formatter: (value) => {
                        return value ? value.name : 'Não definido';
                    }
                },
                {
                    'key':'status',
                    'label':'Status',
                },
                {
                    'key':'created_at',
                    'label':'Criado em',
                    formatter: (value) => {
                        return moment(String(value)).format('MM/DD/YYYY')
                    }
                },
                {
                    'key': 'actions',
                    'label' : 'Ações',

                }
            ]
        }),
        mounted() {
            this.getSupportRequests();
        },
        methods: {
            hasPermission(permission){
                if(this.$store.getters.StatePermissions){
                    return this.$store.getters.StatePermissions.includes(permission);
                }else{
                    return false;
                }
            },
            getSupportRequests(){
                let selfVue = this;
                axios.get(`/supportRequests?page=${this.page}&include=requester,responder`).then(response => {
                    this.vehicles = response.data['data'];
                    this.pageSize = response.data['per_page'];
                    this.count = response.data['total'];
                    this.loading = false;
                }, function(error){
                    error;
                    selfVue.$alertify.warning('Houve um erro');
                });
            },
            deleteSupportRequest(item){
                let selfVue = this;
                this.$alertify.confirm(
                    `Deseja mesmo deletar a solicitação do(a): "${item.requester.name}"?`,
                    function(){
                        axios.delete(`/supportRequests/${item.id}`).then(response => {
                            selfVue.$alertify.success('Solicitação de suporte deletada com sucesso!');
                            selfVue.loading = true;
                            selfVue.getSupportRequests();
                            response;
                        }, function(error){
                            selfVue.$alertify.warning('Houve um erro');
                            error;
                        });
                    },
                    function(){
                        return;
                    }
                );
            },
            toTypeText(value){
                switch(value){
                    case 1:
                        return 'Sugestão';
                    case 2:
                        return 'Melhoria';
                    case 3:
                        return 'Problema';
                    case 4:
                        return 'Solicitação';
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