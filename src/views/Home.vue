<template>
    <main>
        <section ref="map__wrapper" id="content" class="map__wrapper">
            <svg ref="map__element" class="map__element" fill="#ececec" stroke="black" stroke-width=".2" width="100%" viewBox="0 0 2000 857" xmlns="http://www.w3.org/2000/svg">
                <g @click="selectCountry(country.code, $event)" :class="country.code" :key="country.code" v-for="country in $store.state.map_data">
                    <path :fill="getMapColor(country.emission, country.code)" :key="region" v-for="region in country.regions" :d="region"></path>
                </g>
            </svg>
        </section>
        <section id="sidebar">
            <div class="sidebar__header">
                <div @click="tabIndex = 1" class="sidebar__header--tab" :class="{'active': tabIndex == 1}">1</div>
                <div @click="tabIndex = 2" class="sidebar__header--tab" :class="{'active': tabIndex == 2}">2</div>
            </div>
            <div class="sidebar__content">
                <div v-if="tabIndex == 1" class="sidebar__content--tab">
                    <h1>Filter</h1>
                    <table class="filtered__list">
                        <thead>
                            <tr>
                                <td>
                                    <input type="checkbox" :checked="focusCountry.length > 0" @click="checkOrUncheckAllCountries()">
                                </td>
                                <td>LAND</td>
                                <td>Firmenname</td>
                                <td>Emissionen</td>
                            </tr>
                        </thead>
                        <tbody @click="updateFocusCountries(country.code)" :key="country.code" v-for="country in $store.state.map_data">
                            <tr>
                                <td rowspan="4">
                                    <input type="checkbox" :checked="focusCountry.includes(country.code)">
                                </td>
                                <td rowspan="4">{{ country.code }}</td>
                            </tr>
                            <tr v-for="company in country.companies">
                                <td>{{ company.name }}</td>
                                <td>{{ company.emission }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="tabIndex == 2" class="sidebar__content--tab">
                    <h1>Statistik</h1>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            tabIndex: 1,
            selected: null,
            searchString: '',
            color_value_map: [],
            unique_emission_values: this.$store.state.map_data.map(p => p.emission).filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => b - a),
            focusCountry: [],
            mouse: {
                x: 0,
                y: 0
            },
            offset: {
                x: 0,
                y: 0
            },
        }
    },
    methods: {
        checkOrUncheckAllCountries() {
            if(this.focusCountry.length > 0) {
                this.focusCountry = [];
            } else {
                this.focusCountry = this.$store.state.map_data.map(p => p.code);
            }
        },
        updateFocusCountries(code) {
            console.log("updateFocusCountries", code);
            if(this.focusCountry.includes(code)) {
                this.focusCountry = this.focusCountry.filter(p => p != code);
            } else {
                this.focusCountry.push(code);
            }
        },
        selectCountry(code, event) {
            //IF shift key on keayboard is pressed add country to focus
            if(event.shiftKey) {
                this.updateFocusCountries(code);
            }
        },
        getMapColor(val = false, countryCode = false) {

            if(this.focusCountry.length > 0) {
                if(this.focusCountry.includes(countryCode)) {
                //    return 'hsl(180 100% 60%)';
                } else {
                    return 'hsl(0 0% 100%)';
                }
            }

            if(val) {
                let h = Math.round(100 / this.unique_emission_values.length * this.unique_emission_values.indexOf(val));
                let s = val * 500;
                let l = 100 - ((1 - val) * 100);

                if(l > 50) {
                    l = 50;
                }

                return 'hsl(' + h + ' 100% '+l+'%)';
            }
        },
    },
    created() {

        
    },
    destroyed() {
        document.removeEventListener("mousedown", this.onMouseDown);
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/utilities/_variables.scss";
    main{
        display: grid;
        grid-template-columns: auto 600px;
        height: calc(100% - 48px);
        position: relative;
        overflow: hidden;
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
    }

    #sidebar{
        display: grid;
        border-left: 2px solid black;
        grid-template-rows: 48px auto;
        overflow: auto;

        .sidebar__header{
            display: grid;
            grid-template-columns: 50% 50%;
            
            .sidebar__header--tab{
                text-align: center;
                line-height: 48px;
                background-color: #CeCECe;
                cursor: pointer;
                transition: all .2s ease-in-out;

                &.active{
                    background-color: #fff;
                }
            }
        }

        .sidebar__content{
            padding: 20px;

            .sidebar__content--tab{
                .filtered__list{
                    width: 100%;
                    border: none;
                    border-collapse: collapse;

                    tbody:nth-child(odd){
                        background-color: #f2f2f2;
                    }

                    td{}
                }
            }
        }
    }
</style>