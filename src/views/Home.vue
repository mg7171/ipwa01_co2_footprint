<template>
    <main :class="getMainClass()">
        <section ref="map__wrapper" id="content" class="map__wrapper">
            <svg ref="map__element" id="map__element" fill="#ececec" stroke="black" stroke-width=".2" width="100%" viewBox="0 0 2000 857" xmlns="http://www.w3.org/2000/svg">
                <g @click="selectCountry(country.code, $event)" :class="country.code" :key="country.code" v-for="country in $store.state.map_data">
                    <path :data-country="country.code" :fill="getMapColor(country.emission, country.code)" :key="region" v-for="region in country.regions" :d="region"></path>
                </g>
            </svg>
            <div v-if="current_country" class="country__name">
                <b>{{current_country.country}}: {{current_country.emission.toLocaleString()}} Mio. t</b>
                <ul>
                    <li v-for="company in current_country.companies">
                        {{company.name}}: {{company.emission.toLocaleString()}} Mio. t
                    </li>
                </ul>
            </div>
            <div @click="updateMapLayout('filter')" class="toggle__sidebar">
                <img v-if="mapLayout != 'filter'" src="@/assets/list.svg" alt="Filter">
                <img v-else src="@/assets/close.svg" alt="Close">
            </div>
            <div @click="updateMapLayout('graph')" class="toggle__graph">
                <img v-if="mapLayout != 'graph'" src="@/assets/statistic.svg" alt="Statistic">
                <img v-else src="@/assets/close.svg" alt="Close">
                
            </div>
        </section>
        <section id="sidebar" class="sidebar__header--big">
            <div class="sidebar__header">
                <h1>Countries</h1>
                <table class="filtered__list">
                    <thead>
                        <tr>
                            <td class="list__entry--checkbox">
                                <input type="checkbox" :checked="focusCountry.length > 0" @click="checkOrUncheckAllCountries()">
                            </td>
                            <td colspan="2" class="column--sortable" @click="updateSorting('country')">Country <span v-if="currentSort == 'country' && sortDirection.country == 'asc'">&uarr;</span><span v-else-if="currentSort == 'country' && sortDirection.country == 'desc'">&darr;</span><span v-else>&rarr;</span></td>
                            <td class="column--sortable column--right" @click="updateSorting('emission')">Emission (Mio. t / Year) <span v-if="currentSort == 'emission' && sortDirection.emission == 'asc'">&uarr;</span><span v-else-if="currentSort == 'emission' && sortDirection.emission == 'desc'">&darr;</span><span v-else>&rarr;</span></td>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="sidebar__content">
                <table class="filtered__list">
                    <tbody @click="updateFocusCountries(country.code)" :key="country.code" v-for="country in $store.state.map_data">
                        <tr>
                            <td class="list__entry--checkbox" rowspan="2">
                                <input type="checkbox" :checked="focusCountry.includes(country.code)">
                            </td>
                            <td class="list__entry--country" colspan="2">{{country.country}}</td>
                            <td class="list__entry--emission" colspan="2">{{country.emission}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <section id="sidebar">
            <div class="sidebar__header">
                <h1>Statistic (Mio. t / Year)</h1>
            </div>
            <div class="sidebar__content">
                <div v-if="focusCountry.length > 0" :style="getChartHeight()">
                    <Bar
                        id="my-chart-id"
                        :options="chartOptions"
                        :data="chartData"
                    />
                </div>
                <div v-else class="no__country--selected">
                    At least one country must be selected.
                </div>
            </div>
        </section>
    </main>
</template>

<script>
    import { Bar } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

    export default {
        name: 'Home',
        components: {
            Bar,
        },
        data() {
            return {
                currentMaxValue: 0,
                chartData: {
                    labels: [],
                    datasets: []
                },
                chartOptions: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false
                },
                current_country: null,
                selected: null,
                searchString: '',
                color_value_map: [],
                unique_emission_values: this.$store.state.map_data.map(p => p.emission).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => b - a),
                focusCountry: ['AT', 'DE', 'CH'],
                //focusCountry: this.$store.state.map_data.map(p => p.code),
                mapLayout: [],
                sortDirection: {
                    country: 'asc',
                    emission: 'asc'
                },
                currentSort: 'country',
                mouse: {
                    x: 0,
                    y: 0
                },
                //get total emission of map_data object
                total_world_emission: this.$store.state.map_data.map(p => p.emission).reduce((a, b) => a + b, 0).toFixed(2),
                total_filtered_emission: 0,
            }
        },
        methods: {
            getChartHeight() {
                return `height: ${this.focusCountry.length * 30 + 70}px`;
            },
            updateGraph() {
                this.chartData = {
                    labels: this.focusCountry.map(p => this.$store.state.map_data.find(c => c.code === p).country),
                    datasets: [ { data: this.focusCountry.map(p => this.$store.state.map_data.find(c => c.code === p).emission) } ]
                }
            },
            getGraphWidth(emission) {
                const percentage = emission === 'world' ?
                this.total_filtered_emission / this.total_world_emission :
                emission / this.total_world_emission;

                return `${(percentage * 100).toFixed(2)}%`;
            },
            updateMapLayout(layout) {
            this.mapLayout = this.mapLayout.includes(layout) ? [] : [layout];
            },
            getMainClass() {
                const layout = this.mapLayout[0];

                if (layout === 'graph') {
                    return 'map--graph';
                } else if (layout === 'filter') {
                    return 'map--filter';
                }
            },
            updateSorting(column) {
                this.currentSort = column;

                const sortDir = this.sortDirection[column] === 'asc' ? 1 : -1;
                const sortedData = this.$store.state.map_data.sort((a,b) => {
                    if (column === 'country') {
                        return sortDir * a.country.localeCompare(b.country);
                    } else if (column === 'emission') {
                        return sortDir * (a.emission - b.emission);
                    }
                });

                this.$store.state.map_data = sortedData;
                this.sortDirection[column] = (sortDir === 1) ? 'desc' : 'asc';
            },
            checkOrUncheckAllCountries() {
                if(this.focusCountry.length > 0) {
                    this.focusCountry = [];
                } else {
                    this.focusCountry = this.$store.state.map_data.map(p => p.code);
                }
                this.total_filtered_emission = this.$store.state.map_data.filter(p => this.focusCountry.includes(p.code)).map(p => p.emission).reduce((a, b) => a + b, 0).toFixed(2);
                this.updateGraph();
                this.getChartHeight();
            },
            updateFocusCountries(code) {
                if(this.focusCountry.includes(code)) {
                    this.focusCountry = this.focusCountry.filter(p => p != code);
                } else {
                    this.focusCountry.push(code);
                }
                this.total_filtered_emission = this.$store.state.map_data.filter(p => this.focusCountry.includes(p.code)).map(p => p.emission).reduce((a, b) => a + b, 0).toFixed(2);
                this.updateGraph();
                this.getChartHeight();
            },
            selectCountry(code, event) {
                //IF shift key on keayboard is pressed add country to focus
                if(event.shiftKey || true) {
                    this.updateFocusCountries(code);
                }
            },
            getMapColor(val = false, countryCode = false) {

                if(!this.focusCountry.includes(countryCode)) {
                    return 'hsl(0 0% 100%)';
                }
                if(val < 1) {
                    //RETURN LIGHT BLUE
                    return 'hsl(200, 100%, 90%)';
                }

                if(val) {
                    const minValue = 1;
                    const maxValue = 12466.32;
                    const hueStart = 90;
                    const hueEnd = 0;
                    const saturation = 100;
                    const lightness = 70;
                    const normalizedValue = (val - minValue) / (maxValue - minValue);
                    const hue = hueStart + (hueEnd - hueStart) * normalizedValue;

                    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                }
            },
        },
        created() {
            document.addEventListener("mouseover", event => {
                if(event.target.getAttribute("data-country")) {
                    this.current_country = this.$store.state.map_data.find(p => p.code === event.target.getAttribute("data-country"));
                } else {
                    this.current_country = null;
                }
            });

            document.addEventListener("mouseout", event => {
                this.current_country = null;
            });

            this.total_filtered_emission = this.$store.state.map_data.filter(p => this.focusCountry.includes(p.code)).map(p => p.emission).reduce((a, b) => a + b, 0).toFixed(2);

            this.updateGraph();
            this.updateSorting('country');
        },
        destroyed() {
            document.removeEventListener("mouseover");
            document.removeEventListener("mouseout");
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/utilities/_variables.scss";

    .map__wrapper{
        position: relative;
        border: 2px solid $co-main;
    }

    main{
        display: grid;
        grid-template-columns: 100% 0px 0px;
        height: 100%;
        position: relative;
        overflow: hidden;
        &.map--filter{
            grid-template-columns: auto 450px 0px;
        }
        &.map--graph{
            grid-template-columns: auto 0px 450px;
        }
    }

       #content{
        background-color: lightgrey;
        overflow-x: auto;
        overflow-y: hidden;

        svg{
            cursor: move;
            width: auto;
            height: 100%;

            
            path{
                cursor: pointer;
            }
        }
    }

    h1{
        margin: 0;
        text-align: center;
        color: $co-main;
    }

    #sidebar{
        display: grid;
        grid-template-rows: 44px calc(100% - 44px);
        grid-template-rows: 44px auto;
        overflow: hidden;

        &.sidebar__header--big{
            grid-template-rows: 80px calc(100% - 100px);
        }

        &.sidebar--navigation{
            h1{
                padding: 0 20px;
            }
        }

        .sidebar__header{
            padding: 10px 20px 10px 0;

            h1{
                margin-bottom: 10px;
            }
            border-bottom: 2px solid #f2f2f2;
        }
        .sidebar__content{
            overflow: auto;
            height: 100%;
        }

        .filtered__list{
            cursor: pointer;
            user-select: none;
            width: 100%;
            border: none;
            border-collapse: collapse;

            tbody:nth-child(odd){
                background-color: #f2f2f2;
            }
        }

        .list__entry--country{
            padding: 5px 0;
        }

        .list__entry--emission{
            text-align: right;
            font-style: italic;
            padding-right: 20px;
        }

        .list__entry--checkbox{
            padding-left: 20px;
            width: 64px;

            input{
                width: 24px;
                height: 24px;
            }
        }

        .column--right{
            text-align: right;
        }

        .column--sortable{
            cursor: pointer;

            span{
                width: 12px;
                display: inline-block;
                text-align: center;
            }
        }
    }
    .country__name{
        position: fixed;
        left: 140px;
        top: 214px;
        border: 1px solid #FFFFFF;
        padding:  10px;
        background-color: #FFFFFF;;
        box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
        border-radius: 5px;
        box-sizing: border-box;

        ul{
            padding: 0;
            margin: 10px 0 0 0;
            list-style: none;

            li{
            display: flex;
            justify-content: flex-start;

                &:before{
                    content: "›";
                    font-size: 24px;
                    display: block;
                    color: $co-main;
                    margin-right: 10px;
                }
            }
        }
    }

    .toggle__sidebar,
    .toggle__graph,
    .toggle__navigation{
        box-sizing: border-box;
        position: fixed;
        top: 78px;
        left: 140px;
        border: 1px solid #FFFFFF;
        width: 48px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        background-color: #FFFFFF;;
        box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
        padding: 8px;
    }

    .toggle__graph{
        top: 146px;
    }

    .graph__wrapper{
        margin-top: 20px;
        padding: 0 20px;

        .graph{
            background-color: #f2f2f2;
        }

        .graph__bar{
            height: 40px;
            background-color: green;
        }
    }

    .no__country--selected{
        padding: 20px 0;
        font-style: italic;
        text-align: center;
    }

    input[type="checkbox"]:checked{
        background-color: $co-main;
        appearance: none;
        border-radius: 4px;
        margin: 2px 4px 1px 4px;
        position: relative;

        &:after{
            content: "✔";
            color: #FFFFFF;
            font-size: 16px;
            font-weight: bold;
            display: block;
            text-align: center;
            line-height: 16px;
            position: absolute;
            top: 4px;
            left: 5px;
        }
    }
</style>