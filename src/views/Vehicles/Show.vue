<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    {{form.name}}
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="updateVehicle">
                    <div class="card-body">
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputName">Nome</Label>
                                    <b-form-input type="text" name="name" id="inputName" v-model="form.name" :state="formErrors.name == '' ? null : false"
                                                :readonly="!editVehicle" required placeholder="Digite o nome do veículo..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputPlate">Placa</Label>
                                    <b-form-input type="text" name="plate" id="inputPlate" v-model="form.plate" :state="formErrors.plate == '' ? null : false"
                                                :readonly="!editVehicle" required placeholder="Digite a placa..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.plate }} </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputStatus">Status</Label>
                                    <b-form-select name="status" id="inputStatus" v-model="form.status" :disabled="!editVehicle" :options="statusOptions" :state="formErrors.status == '' ? null : false"></b-form-select>
                                    <div class="invalid-feedback d-block"> {{ formErrors.status }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <p> Dados de rastreamento: </p>
                        <b-row form>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inpuProvider">Provedor</Label>
                                    <b-form-select :disabled="!editVehicle" name="provider" id="inpuProvider" required v-model="form.provider_id" :options="providers" :state="formErrors.provider_id == null ? null : false"></b-form-select>
                                    <div class="invalid-feedback d-block"> {{ formErrors.provider_id }} </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" sm="12">
                                <b-form-group>
                                    <Label for="inputSensor">Sensor</Label>
                                    <b-form-input type="text" name="sensor_identifier" id="inputSensor" v-model="form.sensor_identifier" :state="formErrors.sensor_identifier == '' ? null : false"
                                                :readonly="!editVehicle" required placeholder="Digite o identificador do sensor..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.sensor_identifier }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <p v-if="showError" id="error" class="text-danger">{{ errorMessage }}</p>
                    </div>
                    <div class="text-right d-block p-3 card-footer">
                        <button v-if="!editVehicle" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-outline-danger btn-lg mr-2" type="button" @click="goBack()">
                            Voltar
                        </button>
                        <button v-if="!editVehicle && this.hasPermission('update vehicles')" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-info btn-lg text-white" type="button" @click="editVehicle = true">
                            Editar
                        </button>
                        <button v-if="editVehicle" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-danger btn-lg text-white mr-2" type="button" @click="editVehicle = false">
                            Cancelar
                        </button>
                        <button v-if="editVehicle" class="btn-pill btn-shadow btn-wide fsize-1 btn btn-success btn-lg text-white" type="submit">
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
                    status: "",
                    provider_id : 1,
                    sensor_identifier: "",
                },
                formErrors: {
                    plate: "",
                    name: "",
                    status: "",
                    provider_id : null,
                    sensor_identifier: "",
                },
                statusOptions: [
                    { value: 0, text: 'Inativo' },
                    { value: 1, text: 'Ativo' },
                ],
                editVehicle : false,
                showError: false,
                errorMessage: "",
                loading: false,
                providers: null,
            };
        },
        created() {
            this.getSensorProviders();
            this.getVehicle(this.$route.params.id);
            this.$watch(
            () => this.$route.params,
            (toParams) => {
                this.getVehicle(toParams.id);
            }
            )
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
                this.$router.push({name: 'vehiclesIndex'});
            },
            getVehicle(id){
                this.loading = true;
                let selfVue = this;
                axios.get(`/vehicles/${id}`).then(response => {
                    this.form.plate = response.data['plate'];
                    this.form.name = response.data['name'];
                    this.form.status = response.data['status'];
                    this.form.provider_id = response.data['provider_id'];
                    this.form.sensor_identifier = response.data['sensor_identifier'];
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
            async updateVehicle(){
                this.loading = true;
                let selfVue = this;
                await axios.patch(`vehicles/${this.$route.params.id}`, this.form).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.editVehicle = false;
                    this.$alertify.success('Veículo atualizado com sucesso!');
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
                            selfVue.errorMessage = "Houve um erro ao editar o veículo, tente novamente mais tarde!";
                        }
                    }
                });
            },

            getSensorProviders(){
                this.loading = true;
                let selfVue = this;
                axios.get('sensorProviders').then(response => {
                    let index = 0;
                    let array = [];
                    while (index < response.data.length) {
                        array[index] = {
                            value: response.data[index].id,
                            text: response.data[index].name,
                        }
                        index++;
                    }
                    this.providers = array;
                    this.loading = false;
                    
                }, function (){
                    selfVue.$alertify.warning('Houve um erro');
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>