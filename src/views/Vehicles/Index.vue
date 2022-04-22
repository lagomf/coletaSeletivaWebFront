<template>
    <div>
        <page-title 
            :heading="heading" 
            :subheading="subheading" 
            :icon="icon" 
            createModelText='veículo'
            :canCreate="hasPermission('create vehicles')"
            @createModelEvent="createVehicle">
            </page-title>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Veículos
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
                            <b-badge v-if="row.value" pill variant="success" class="text-white">Ativo</b-badge>
                            <b-badge v-if="!row.value" pill variant="danger" class="text-white">Inativo</b-badge>
                        </template>
                        <template #cell(actions)="row">
                            <router-link v-if="hasPermission('show vehicles')" :to="{name:'vehiclesShow',params:{id:row.item.id}}" class="btn btn-info mr-1 p-1"><i class="pe-7s-info text-white"></i></router-link>
                            <b-button v-if="hasPermission('delete vehicles')" @click="deleteVehicle(row.item)" class="mr-1 p-1">
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
            heading: 'Gerenciar veículos',
            subheading: 'Adicionar, pesquisar, editar e deletar veículos.',
            icon: 'pe-7s-car icon-gradient bg-tempting-azure',

            vehicles : {

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
                    'key':'name',
                    'label':'Nome',
                },
                {
                    'key':'plate',
                    'label':'Placa',
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
            this.getVehicles();
        },
        methods: {
            hasPermission(permission){
                if(this.$store.getters.StatePermissions){
                    return this.$store.getters.StatePermissions.includes(permission);
                }else{
                    return false;
                }
            },
            getVehicles(){
                axios.get(`/vehicles?page=${this.page}`).then(response => {
                    this.vehicles = response.data['data'];
                    this.pageSize = response.data['per_page'];
                    this.count = response.data['total'];
                    this.loading = false;
                }, function(error){
                    error;
                    this.$alertify.warning('Houve um erro');
                });
            },
            createVehicle(){
                this.$router.push({name:"vehiclesCreate"});
            },
            deleteVehicle(item){
                let selfVue = this;
                this.$alertify.confirm(
                    `Deseja mesmo deletar "${item.name}"?`,
                    function(){
                        axios.delete(`/vehicles/${item.id}`).then(response => {
                            selfVue.$alertify.success('Veículo deletado com sucesso!');
                            selfVue.loading = true;
                            selfVue.getVehicles();
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
            handlePageChange(value){
                this.page = value;
                this.getVehicles();
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>