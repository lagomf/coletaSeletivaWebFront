<template>
    <div>
        <div class="mb-3 card">
            <div class="card-header-tab card-header">
                <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                    <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                    Criar Rota
                </div>
            </div>
            <b-overlay :show="loading" variant="transparent" rounded="sm">
                <form @submit.prevent="createRoute">
                    <div class="card-body">
                        <b-row form>
                            <b-col md="12">
                                <b-form-group>
                                    <Label for="inputName">Nome</Label>
                                    <b-form-input type="text" name="name" id="inputName" v-model="form.name" :state="formErrors.name == '' ? null : false"
                                                required placeholder="Digite o nome da rota..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.name }} </div>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row form>
                            <b-col md="6">
                                <b-form-group>
                                    <Label for="inputColor">Cor</Label>
                                    <b-form-input type="text" name="color" id="inputColor" v-model="form.color" :state="formErrors.color == '' ? null : false"
                                                required placeholder="Digite a cor..."/>
                                    <div class="invalid-feedback d-block"> {{ formErrors.color }} </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <h3 class="mt-4"><span class="badge" v-bind:style="{background: form.color, border: '1px solid black'}">&zwnj; &zwnj; &zwnj;</span></h3>
                            </b-col>
                        </b-row>
                        <div class="divider"/>
                        <p> Dias da semana: </p>
                        <b-row form>
                            <b-col md="12">
                                <b-form-checkbox-group
                                    v-model="form.days"
                                    :options="days"
                                    name="days"
                                    buttons
                                ></b-form-checkbox-group>
                                <div class="invalid-feedback d-block"> {{ formErrors.days }} </div>
                            </b-col>
                        </b-row>
                        <div class="divider"/>
                        <p> Bairros: </p>
                        <b-row form>
                            <b-col md="6" sm="12">
                                <multiselect v-model="form.districts" :options="districts" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Selecione os barriros" label="name" track-by="name">
                                    <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} bairro(s) selecionados</span></template>
                                </multiselect>
                                <div class="invalid-feedback d-block"> {{ formErrors.districts }} </div>
                            </b-col>
                            <b-col md="6" sm="12">
                                <b-badge variant="primary" class="m-1" v-for="district in form.districts" :key="'dis'+district.value">{{district.name}}</b-badge>
                            </b-col>
                        </b-row>
                        <div class="divider"/>
                        <p> Coordenadas: </p>
                        <b-row form>
                            <b-col md="4" sm="12" class="mb-sm-3">
                                <b-form-textarea
                                    id="coordinates"
                                    v-model="form.coordinates"
                                    placeholder="Entre com as coordenadas separadas por vírgulas e divididas entre quebras de linha..."
                                    rows="21"
                                    max-rows="500"
                                    required
                                    :state="formErrors.coordinates == '' ? null : false"
                                ></b-form-textarea>
                                <div class="invalid-feedback d-block"> {{ formErrors.coordinates }} </div>
                            </b-col>
                            <b-col md="8" sm="12">
                                <div style="height: 70vh;">
                                    <l-map style="height: 100%; z-index: 1" :zoom="zoom" :center="center">
                                        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                                        <l-polyline :lat-lngs="getCoordinates" :color="form.color" ></l-polyline>
                                        <l-polyline-decorator
                                            :paths="getCoordinates"
                                            :patterns="parsePattern(form.color)"
                                        ></l-polyline-decorator>
                                    </l-map>
                                </div>
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
    import Multiselect from 'vue-multiselect';
    import { LMap, LTileLayer, LPolyline} from 'vue2-leaflet';
    import L from "leaflet";
    import Vue2LeafletPolylinedecorator from 'vue2-leaflet-polylinedecorator'
    export default {
        components: {
            Multiselect,
            LMap,
            LTileLayer,
            LPolyline,
            "l-polyline-decorator": Vue2LeafletPolylinedecorator,
        },
        data() {
            return {
                form: {
                    color: "#FF0000",
                    name : "",
                    days : [],
                    districts: [],
                    coordinates: "",
                },
                formErrors: {
                    color: "",
                    name: "",
                    days : null,
                    districts: "",
                    coordinates: "",
                },
                showError: false,
                errorMessage: "",
                loading: false,
                districts : [],
                days: [
                    { text: 'Dom', value: 0 },
                    { text: 'Seg', value: 1 },
                    { text: 'Ter', value: 2 },
                    { text: 'Qua', value: 3 },
                    { text: 'Qui', value: 4 },
                    { text: 'Sex', value: 5 },
                    { text: 'Sab', value: 6 },
                ],
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                center: [-24.728290852779235, -53.73735017547846],
                zoom: 13,
            };
        },
        created() {
            this.getDistricts();
        },
        computed: {
            getDistrictsIds(){
                let index = 0;
                let array = [];
                while (index < this.form.districts.length) {
                    array[index] = this.form.districts[index].value;
                    index++;
                }
                return array;
            },
            getCoordinates() {
                let array = this.form.coordinates.split('\n');
                if(array.length == 1 && array[0] == ''){
                    return [];
                }
                let selfVue = this;
                return array.filter(function(value){
                    let condition = (value.split(',')).length == 2;
                    if(!condition && value != ''){
                        selfVue.$alertify.warning("'"+value+"' não é uma coordenanda válida!");
                    }
                    return condition;
                }).map(function(value){
                    let sub = value.split(',');
                    return [+parseFloat(sub[0]).toFixed(6),+parseFloat(sub[1]).toFixed(6)]
                });
            }
        },
        methods: {
            goBack(){
                this.$router.push({name: 'routesIndex'});
            },
            async createRoute(){
                this.loading = true;
                let selfVue = this;
                let parsedForm = {
                    color: this.form.color,
                    name: this.form.name,
                    days: this.form.days,
                    districts: this.getDistrictsIds,
                    coordinates: this.getCoordinates
                };
                this.formErrors = {
                    color: "",
                    name: "",
                    days : null,
                    districts: "",
                    coordinates: "",
                };
                await axios.post(`routes`, parsedForm).then(response => {
                    this.showError = false;
                    this.loading = false;
                    this.editProfile = false;
                    this.form = {
                        color: "#",
                        name : "",
                        days : [],
                        districts: [],
                        coordinates: "",
                    };
                    this.$alertify.success('Rota criada com sucesso!');
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
                            selfVue.errorMessage = "Houve um erro ao criar a rota, tente novamente mais tarde!";
                        }
                    }
                });
            },

            getDistricts(){
                this.loading = true;
                let selfVue = this;
                axios.get('districts').then(response => {
                    let index = 0;
                    let array = [];
                    while (index < response.data.length) {
                        array[index] = {
                            value: response.data[index].id,
                            name: response.data[index].name,
                        }
                        index++;
                    }
                    this.districts = array;
                    this.loading = false;
                    
                }, function (){
                    selfVue.$alertify.warning('Houve um erro');
                });
            },
            parsePattern(color){
                return [
                    {
                        offset: 12,
                        repeat: 25,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 7,
                            pathOptions: { color: color, weight: 2, stroke: true },
                        }),
                    },
                ]
            },
        }
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>

</style>