<template>
    <div class="pb-2">
        <page-title :heading="heading" :subheading="subheading" :icon="icon"></page-title>
        <b-row class="mb-3">
            <b-col cols="12" md="4" class="mb-2 mb-md-0 text-center text-md-left">
                <Label for="districtInput">Bairro</Label>
                <b-form-select id="districtInput" v-model="districtSelected" :options="districtSelect" @change="daySelected=null;getRoutes();"></b-form-select>
            </b-col>
            <b-col cols="12" md="8" class="text-center text-md-left px-0 ">
                <p class="mb-1 mb-md-2 pl-0 pl-md-3">Dia da semana</p>
                <b-overlay :show="loading" variant="transparent" rounded="sm">
                    <template #overlay>
                        <div class="d-flex align-items-center">
                        <b-spinner small type="grow" variant="light"></b-spinner>
                        <b-spinner type="grow" variant="secondary"></b-spinner>
                        <b-spinner small type="grow" variant="light"></b-spinner>
                        <!-- We add an SR only text for screen readers -->
                        </div>
                    </template>
                    <b-button-group style="width:100%;" class="px-3">
                        <b-button :disabled="districtSelected == null || loading" :variant="day.value == daySelected ? 'secondary' : 'primary'" v-for="day in days" :key="day.value" @click="daySelected = day.value; getRoutes()"><span class="d-none d-sm-block">{{ day.label }}</span><span class="d-block d-sm-none">{{ day.label_small }}</span></b-button>
                    </b-button-group>
                </b-overlay>
            </b-col>
        </b-row>
        <div style="height: 70vh;">
            <l-map style="height: 100%" :zoom="zoom" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                <l-polyline v-for="route in routes" :key="'poly'+route.id" :lat-lngs="getCoordinates(route.coordinates)" :color="route.color" ></l-polyline>
                <l-polyline-decorator
                    v-for="route in routes" :key="'polyd'+route.id"
                    :paths="getCoordinates(route.coordinates)"
                    :patterns="parsePattern(route.color)"
                ></l-polyline-decorator>
                <l-marker v-for="route in routes" :key="'marker'+route.id" :lat-lng="getMarkerCoordinate(route.coordinates)" :name="route.name" >
                    <l-popup>
                        <div>
                            <h6>Cronograma:</h6>
                            <ul class="pl-3">
                                <li v-for="day in route.days" :key="'li'+day.day">{{ parseWeekDay(day.day) }};</li>
                            </ul>
                        </div>
                    </l-popup>
                </l-marker>
            </l-map>
        </div>
    </div>
</template>

<script>

    import PageTitle from "../../Layout/Components/PageTitle.vue";
 
    import { LMap, LTileLayer, LPolyline, LMarker, LPopup } from 'vue2-leaflet';
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
            LMarker, 
            LPopup,
            "l-polyline-decorator": Vue2LeafletPolylinedecorator,
        },
        data: () => ({
            heading: 'Bem vindo(a)!',
            subheading: 'Aqui você pode acompanhar o cronograma das rotas dos caminhões da coleta seletiva da cidade de Toledo.',
            icon: 'pe-7s-map-2 icon-gradient bg-tempting-azure',
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            markerLatLng: [-24.728290852779235, -53.73735017547846],
            zoom: 13,
            loading: false,
            center: [-24.728290852779235, -53.73735017547846],
            districts: null,
            routes: {},
            districtSelected: null,
            days: [
                {value: null, label: 'Todos', label_small: 'Todos'},
                {value: 0, label: 'Dom', label_small: 'D'},
                {value: 1, label: 'Seg', label_small: 'S'},
                {value: 2, label: 'Ter', label_small: 'T'},
                {value: 3, label: 'Qua', label_small: 'Q'},
                {value: 4, label: 'Qui', label_small: 'Q'},
                {value: 5, label: 'Sex', label_small: 'S'},
                {value: 6, label: 'Sáb', label_small: 'S'},

            ],
            daySelected: null,
        }),
        created() {
            this.getDistricts();
        },
        mounted(){
            //this.getRoutes();
        },
        computed: {
            districtSelect(){
                if(this.districts !== null){
                    let arr = this.districts.map(function(x){
                        return {
                            'value': x['id'],
                            'text': x['name']
                        }
                    });
                    arr.unshift({
                        'value': null,
                        'text': '--Selecione um bairro--'
                    });
                    return arr;
                }else{
                    return [];
                }
            }
        },
        methods: {
            getDistricts(){
                let selfVue = this;
                this.loading = true;
                axios.get(`/districts`).then(response => {
                    this.districts = response.data;
                    this.loading = false;

                }, function(){
                    selfVue.$alertify.warning('Houve um erro');
                });
            },

            getRoutes(){
                if(this.districtSelected){
                    let requestParams = {};
                    requestParams.include = 'coordinates,days';
                    requestParams.districts = {};
                    requestParams.districts.id = this.districtSelected;
                    if(this.daySelected != null){
                        requestParams.days = {};
                        requestParams.days.day = this.daySelected;
                    }
                    this.loading = true;
                    let selfVue = this;
                    axios.get(`/routes`,{params : requestParams}).then(response => {
                        this.routes = response.data['data'];
                        this.loading = false;
                    }, function(){
                        selfVue.$alertify.warning('Houve um erro');
                    });
                }else{
                    this.routes = [];
                }
            },

            getCoordinates(data){
                return data.map(function(x){
                    return [
                        x['lat'],x['long']
                    ];
                });
            },

            getMarkerCoordinate(data){
                let index = Math.floor((data.length/2));
                return [
                    data[index]['lat'],data[index]['long']
                ]
            },

            parseWeekDay(day){
                let weekMap = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

                return weekMap[day];
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
