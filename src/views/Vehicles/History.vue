<template>
    <div class="pb-2">
        <b-row>
            <b-col>
                <h4><span class="text-primary">Veículo: </span>{{vehicle.name}}</h4>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col cols="12" md="6">
                <label for="datepicker">Selecione a data</label>
                <b-overlay :show="loading" variant="transparent" rounded="sm">
                    <template #overlay>
                        <div class="d-flex align-items-center">
                        <b-spinner small type="grow" variant="light"></b-spinner>
                        <b-spinner type="grow" variant="secondary"></b-spinner>
                        <b-spinner small type="grow" variant="light"></b-spinner>
                        <!-- We add an SR only text for screen readers -->
                        </div>
                    </template>
                    <b-form-datepicker :disabled="loading" :max="max" id="datepicker" @input="getSensorData($route.params.id,date)" v-model="date" class="mb-2"></b-form-datepicker>
                </b-overlay>
            </b-col>
            <b-col v-if="noData" cols="12" md="6" class="pt-0 pt-md-2">
                <h6 class="text-danger mt-0 mt-md-4">Nenhum registro encontrado para a data selecionada!</h6>
            </b-col>
        </b-row>
        <div style="height: 70vh;">
            <l-map style="height: 100%; z-index: 1;" :zoom="zoom" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-polyline  :lat-lngs="route" :color="'#ff0000'" ></l-polyline>
                <l-polyline-decorator
                    :paths="route"
                    :patterns="parsePattern('#ff0000')"
                ></l-polyline-decorator>
            </l-map>
        </div>
    </div>
</template>

<script>
    import { LMap, LTileLayer, LPolyline} from 'vue2-leaflet';
    import Vue2LeafletPolylinedecorator from 'vue2-leaflet-polylinedecorator'
    import { Icon } from 'leaflet';
    import axios from 'axios';
    import L from "leaflet";
    
    delete Icon.Default.prototype._getIconUrl;
    Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    export default {
        components: {
            LMap,
            LTileLayer,
            LPolyline,
            "l-polyline-decorator": Vue2LeafletPolylinedecorator,
        },
        data: () => ({
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            markerLatLng: [-24.728290852779235, -53.73735017547846],
            zoom: 13,
            loading: false,
            center: [-24.728290852779235, -53.73735017547846],
            route: [],
            vehicle: {},
            date: null,
            max: null,
        }),
        created() {
            this.getVehicle(this.$route.params.id);
            let today = new Date();
            this.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            this.max = this.date;
            this.getSensorData(this.$route.params.id,this.date);
        },
        computed: {
            noData(){
                return this.route.length == 0;
            }
        },
        methods: {
            async getSensorData(id,date){
                let requestParams = {};
                requestParams.date = date;
                this.loading = true;
                let selfVue = this;
                await axios.get(`/sensorData/${id}`,{params : requestParams}).then(response => {
                    this.route = response.data;
                    this.loading = false;
                }, function(){
                    selfVue.$alertify.warning('Houve um erro');
                });
            },
            async getVehicle(id){
                this.loading = true;
                let selfVue = this;
                await axios.get(`/vehicles/${id}`).then(response => {
                    this.vehicle.plate = response.data['plate'];
                    this.vehicle.name = response.data['name'];
                    this.vehicle.status = response.data['status'];
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
            }
        },


    }


</script>
<style scoped >
    #datepicker__dialog_{z-index: 99 !important};
 </style>