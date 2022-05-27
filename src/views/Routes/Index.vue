<template>
    <div>
        <page-title 
            :heading="heading" 
            :subheading="subheading" 
            :icon="icon" 
            createModelText='rota'
            :canCreate="hasPermission('create routes')"
            @createModelEvent="createRoute">
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
                    <b-table responsive striped hover :items="routes" :fields="fields">
                        <template #cell(actions)="row">
                            <router-link v-if="hasPermission('show routes')" :to="{name:'vehiclesShow',params:{id:row.item.id}}" class="btn btn-info mr-1 p-1"><i class="pe-7s-info text-white"></i></router-link>
                            <b-button v-if="hasPermission('delete routes')" @click="deleteRoute(row.item)" class="mr-1 p-1">
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
            heading: 'Gerenciar rotas',
            subheading: 'Adicionar, pesquisar, editar e deletar rotas.',
            icon: 'pe-7s-map-marker icon-gradient bg-tempting-azure',

            routes : {

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
                    'key':'districts',
                    'label':'Bairros',
                    formatter: (value) => {
                        return value.length;
                    }
                },
                {
                    'key':'days',
                    'label':'Dias',
                    formatter: (value) => {
                        return value.length;
                    }
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
            this.getRoutes();
        },
        methods: {
            hasPermission(permission){
                if(this.$store.getters.StatePermissions){
                    return this.$store.getters.StatePermissions.includes(permission);
                }else{
                    return false;
                }
            },
            getRoutes(){
                let selfVue = this;
                axios.get(`/routes?include=districts,days&page=${this.page}`).then(response => {
                    this.routes = response.data['data'];
                    this.pageSize = response.data['per_page'];
                    this.count = response.data['total'];
                    this.loading = false;
                }, function(error){
                    error;
                    selfVue.$alertify.warning('Houve um erro');
                });
            },
            createRoute(){
                this.$router.push({name:"routesCreate"});
            },
            deleteRoute(item){
                let selfVue = this;
                this.$alertify.confirm(
                    `Deseja mesmo deletar "${item.name}"?`,
                    function(){
                        axios.delete(`/routes/${item.id}`).then(response => {
                            selfVue.$alertify.success('Rota deletada com sucesso!');
                            selfVue.loading = true;
                            selfVue.getRoutes();
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
                this.getRoutes();
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>