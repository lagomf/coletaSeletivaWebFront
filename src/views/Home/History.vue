<template>
    <div class="pb-2">
        <page-title :heading="heading" :subheading="subheading" :icon="icon"></page-title>
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
                    <b-form-datepicker :disabled="loading" :max="max" id="datepicker" @input="getSensorData(date)" v-model="date" class="mb-2"></b-form-datepicker>
                </b-overlay>
            </b-col>
            <b-col v-if="noData" cols="12" md="6" class="pt-0 pt-md-2">
                <h6 class="text-danger mt-0 mt-md-4">Nenhum registro encontrado para a data selecionada!</h6>
            </b-col>
        </b-row>
        <div style="height: 70vh;">
            <l-map style="height: 100%; z-index: 1" :zoom="zoom" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-polyline v-for="(route,key) in routes" :key="'poly'+key" :lat-lngs="route" :color="colors[key]" ></l-polyline>
                <l-polyline-decorator
                    v-for="(route,key) in routes" :key="'polyd'+key"
                    :paths="route"
                    :patterns="parsePattern(colors[key])"
                ></l-polyline-decorator>
            </l-map>
        </div>
    </div>
</template>

<script>

    import PageTitle from "../../Layout/Components/PageTitle.vue";
 
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
            PageTitle,
            LMap,
            LTileLayer,
            LPolyline,
            "l-polyline-decorator": Vue2LeafletPolylinedecorator,
        },
        data: () => ({
            heading: 'Histórico de rotas',
            subheading: 'Aqui você pode acompanhar as rotas executadas pelos caminhões da coleta seletiva da cidade de Toledo.',
            icon: 'pe-7s-map-marker icon-gradient bg-tempting-azure',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            markerLatLng: [-24.728290852779235, -53.73735017547846],
            zoom: 13,
            loading: false,
            center: [-24.728290852779235, -53.73735017547846],
            routes: {},
            date: null,
            max: null,
            colors: [],
        }),
        created() {
            let today = new Date();
            this.date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            this.max = this.date;
            this.getSensorData(this.date);
        },
        computed: {
            noData(){
                return this.routes.length == 0;
            }
        },
        methods: {
            getSensorData(date){
                let requestParams = {};
                requestParams.date = date;
                this.loading = true;
                let selfVue = this;
                axios.get(`/sensorData/all`,{params : requestParams}).then(response => {
                    this.routes = response.data;
                    for (let i = 0; i < response.data.length; i++) {
                        this.colors[i] = this.randomColor();
                    }
                    this.loading = false;
                }, function(){
                    selfVue.$alertify.warning('Houve um erro');
                });
            },
            randomColor(){
                return '#'+Math.floor(Math.random()*16777215).toString(16)
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
