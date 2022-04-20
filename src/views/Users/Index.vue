<template>
    <div>
        <page-title 
            :heading="heading" 
            :subheading="subheading" 
            :icon="icon" 
            createModelText='usuário'
            :canCreate="hasPermission('create users')"
            @createModelEvent="createUser">
            </page-title>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Usuários
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
                    <b-table responsive striped hover :items="users" :fields="fields">
                        <template #cell(actions)="row">
                            <router-link :to="{name:'usersShow',params:{id:row.item.id}}" class="btn btn-info mr-1 p-1"><i class="pe-7s-info text-white"></i></router-link>
                            <b-button v-if="hasPermission('delete users') && !isUser(row.item.id)" @click="deleteUser(row.item)" class="mr-1 p-1">
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
            heading: 'Gerenciar usuários',
            subheading: 'Adicionar, pesquisar, editar e deletar usuários.',
            icon: 'pe-7s-users icon-gradient bg-tempting-azure',

            users : {

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
                    'key':'email',
                    'label':'E-mail',
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
            this.getUsers();
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
            getUsers(){
                axios.get(`/users?page=${this.page}`).then(response => {
                    this.users = response.data['data'];
                    this.pageSize = response.data['per_page'];
                    this.count = response.data['total'];
                    this.loading = false;
                }, function(error){
                    error;
                    this.$alertify.warning('Houve um erro');
                });
            },
            createUser(){
                this.$router.push({name:"usersCreate"});
            },
            deleteUser(item){
                this.$alertify.confirm(
                    `Deseja mesmo deletar "${item.name}"?`,
                    function(){
                        alert('oi');
                        axios.delete(`/users/${item.id}`).then(response => {
                            this.$alertify.success('Usuário deletado com sucesso!');
                            this.loading = true;
                            this.getUsers();
                            response;
                        }, function(error){
                            this.$alertify.warning('Houve um erro');
                            error;
                        });
                    },
                    function(){
                        alert('tchau');
                    }
                );
            },
            handlePageChange(value){
                this.page = value;
                this.getUsers();
            }
        }

    }
</script>

<style lang="scss" scoped>

</style>