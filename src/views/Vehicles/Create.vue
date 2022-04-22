<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Criar Veículo
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="createVehicle">
                    <div class="card-body">
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputName">Nome</Label>
                                    <b-form-input type="text" name="name" id="inputName" v-model="form.name" :state="formErrors.name == '' ? null : false"
                                                required placeholder="Digite o nome do veículo..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputPlate">Placa</Label>
                                    <b-form-input type="text" name="plate" id="inputPlate" v-model="form.plate" :state="formErrors.plate == '' ? null : false"
                                                required placeholder="Digite a placa..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.plate }} </div>
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
                    plate: "",
                    name : "",
                },
                formErrors: {
                    plate: "",
                    name: "",
                },
                showError: false,
                errorMessage: "",
                loading: false,
            };
        },
        methods: {
            goBack(){
                this.$router.push({name: 'vehiclesIndex'});
            },
            async createVehicle(){
                this.loading = true;
                let selfVue = this;
                await axios.post(`vehicles`, this.form).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.editProfile = false;
                    this.form = {
                        plate: "",
                        name : "",
                    };
                    this.$alertify.success('Veículo criado com sucesso!');
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
                            selfVue.errorMessage = "Houve um erro ao criar o veículo, tente novamente mais tarde!";
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>