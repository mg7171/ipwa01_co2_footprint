<template>
    <main v-if="true">
        <section ref="map__wrapper" id="content" class="map__wrapper">
            <svg ref="map__element" class="map__element" fill="#ececec" stroke="black" stroke-width=".2" width="100%" viewBox="0 0 2000 857" xmlns="http://www.w3.org/2000/svg">
                <g @click="selectCountry(country.code, $event)" :class="country.code" :key="country.code" v-for="country in $store.state.map_data">
                    <path :fill="getMapColor(country.emission, country.code)" :key="region" v-for="region in country.regions" :d="region"></path>
                </g>
            </svg>
        </section>
        <div v-if="statisticVisble" class="overlay__statistic">
            <div class="overlay__statistic--header">
                <h1>Emission pro Jahr</h1>
                <div class="search__wrapper">
                    <input type="text" placeholder="Name, Emission or Country" v-model="searchString">
                    <span class="search__icon" v-if="searchString.length > 0" @click="searchString = ''">
                        <span class="serach__icon--line"></span>
                        <span class="serach__icon--line"></span>
                    </span>
                </div>
            </div>
            <div class="overlay__statistic--content">
                <div class="filtered__list--wrapper">
                    <table class="filtered__list">
                        <tr class="filtered__list--header">
                            <td class="filtered__list--header__name">Name</td>
                            <td class="filtered__list--header__emission">Emission</td>
                            <td class="filtered__list--header__country">Land</td>
                        </tr>
                        <tr @click="focusCountry = company.country" v-for="company in filteredValues" class="filtered__list--item">
                            <td class="filtered__list--item__name">{{company.name}}</td>
                            <td class="filtered__list--item__emission">{{company.emission}} Mio. t</td>
                            <td class="filtered__list--item__country">{{company.country}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div @click="toggleStatistic()" class="overlay__icon"><template v-if="!statisticVisble">?</template><template v-else>X</template></div>
    </main>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            filteredValues: Object.values(this.$store.state.company_data.sort((a, b) => b.emission - a.emission)),
            selected: null,
            searchString: '',
            statisticVisble: false,
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

        selectCountry(code, event) {
            console.log(event.shiftKey);
            //IF shift key on keayboard is pressed add country to focus
            if(event.shiftKey) {
                if(!this.focusCountry.includes(code)) {
                    this.focusCountry.push(code);
                }
            } else {
                this.focusCountry = [code];
            }
            this.searchString = 'country:'+this.focusCountry.join(',')+'';

            if(!this.statisticVisble) {
                this.toggleStatistic();
            }
        },
        toggleStatistic() {
            this.statisticVisble = !this.statisticVisble;
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
        dragStart(e) {
            if(e.target.classList.value == 'map__element' && this.$refs.map__element){
                this.selected = e.target;
                this.mouse.x = e.clientX;
                this.offset.x = this.$refs.map__element.getBoundingClientRect().left;
            }
        },
        dragMove(e) {
            if(this.selected){
                let left = (this.offset.x + e.clientX - this.mouse.x - 0);
                let wrapperWidth = this.$refs.map__wrapper.getBoundingClientRect().width
                let elementWidth = this.$refs.map__element.getBoundingClientRect().width;

                if(left > 0) {
                    left = 0;
                }
                
                if(left < (wrapperWidth - elementWidth)) {
                    left = wrapperWidth - elementWidth;
                }
                
                this.selected.style.marginLeft = left + "px";
            }
        },
        dragEnd(e) {
            this.selected = null;
        }
    },
    watch: {
        searchString: function (val) {
            if(val.startsWith("country:")) {
                let searchString = val.split(":")[1];
                this.filteredValues = Object.values(this.$store.state.company_data.filter(p => p.country.toLowerCase() == searchString.toLowerCase())).sort((a, b) => b.emission - a.emission);
                this.focusCountry = this.filteredValues.map(p => p.country);

                return;
            } else if(val.startsWith("name:")) {
                let searchString = val.split(":")[1];
                this.filteredValues = Object.values(this.$store.state.company_data.filter(p => p.name.toLowerCase() == searchString.toLowerCase())).sort((a, b) => b.emission - a.emission);
                this.focusCountry = this.filteredValues.map(p => p.country);
                return;
            } else if(val.startsWith("emission:") || val.startsWith("emissions:")) {
                let searchString = val.split(":")[1];
                this.filteredValues = Object.values(this.$store.state.company_data.filter(p => p.emission.toString() == searchString.toLowerCase())).sort((a, b) => b.emission - a.emission);
                this.focusCountry = this.filteredValues.map(p => p.country);
                return;
            } else if(val.length >= 0) {
                this.filteredValues = Object.values(this.$store.state.company_data.filter(p => p.name.toLowerCase().includes(val.toLowerCase()) || p.country.toLowerCase().includes(val.toLowerCase()) || p.emission.toString().includes(val.toLowerCase()))).sort((a, b) => b.emission - a.emission);
                this.focusCountry = this.filteredValues.map(p => p.country);
            } else {
                this.filteredValues = Object.values(this.$store.state.company_data.sort((a, b) => b.emission - a.emission));
            }
        }
    },
    created() {
        document.addEventListener("mousedown", e => {
            this.dragStart(e);
        });
        document.addEventListener("touchstart", e => {
            this.dragStart(e);
        });

        document.addEventListener("mousemove", e => {
            this.dragMove(e);
        });
        document.addEventListener("touchmove", e => {
            this.dragMove(e);
        });

        document.addEventListener("mouseup", e => {
            this.dragEnd(e);
        });
        document.addEventListener("touchend", e => {
            this.dragEnd(e);
        });

        
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
        height: calc(100% - 48px);
        grid-template-columns: 100%;
        position: relative;
        overflow: hidden;
    }

    .overlay__statistic{
        position: absolute;
        right: 48px;
        top: 132px;
        width: 30%;
        min-width: 300px;
        background-color: #FFFFFF;
        box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
        border-radius: 5px;
        padding: 40px 20px 20px 20px;
    }
    .overlay__icon{
        box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
        position: absolute;
        right: 48px;
        top: 48px;
        width: 64px;
        height: 64px;
        background-color: #FFFFFF;
        text-align: center;
        line-height: 64px;
        font-size: 32px;
        border-radius: 50%;
        user-select: none;
        cursor: pointer;
    }

    #content{
        background-color: lightgrey;
        overflow: hidden;

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

    .overlay__statistic--content{
        overflow: auto;
        max-height: 50vh;
        margin-right: -20px;
        margin-left: -20px;
    }

    .filtered__list{
        width: 100%;
        border-spacing: 0;

        tr{
            cursor: pointer;
            user-select: none;

            &:hover{
                background-color: #cecece !important;
            }

            &:nth-child(odd){
                background-color: #ececec;
            }
        }

        td{
            border-bottom: 1px solid #ececec;
            padding: 5px 2px;
            border-collapse: collapse;

            &:nth-child(1) {
                padding-left: 20px;
            }

            &:nth-child(2) {
                font-style: italic;
            }

            &:nth-child(3) {
                text-align: center;
                padding-right: 20px;
            }
        }
    }

    .filtered__list--header,
    .filtered__list--item{

        > div{
            padding: 0 5px;
        }
    }

    .filtered__list--header{
        font-weight: bold;
    }

    .overlay__statistic--header{
        input{
            padding: 10px 20px;
            outline: none;
            border: none;
            width: 100%;
            font-size: 16px;
            border-top: 1px solid #ececec;
            border-bottom: 1px solid #ececec;
            margin: 30px -20px 0 -20px;
        }
    }
    .search__wrapper{
        position: relative;

        .search__icon{
            position: absolute;
            right: 0;
            top: 31px;
            display: inline-block;
            height: 38px;
            width: 38px;
            padding: 5px;
            box-sizing: border-box;
            text-align: center;
            cursor: pointer;

            &:after,
            &:before{
                content: "";
                display: inline-block;
                height: 28px;
                width: 1px;
                background-color: #000000;
                transform: rotate(45deg);
            }
            &:before{
                transform: rotate(-45deg);
            }
        }
    }

    @media screen and (max-width: 768px) {
        .overlay__icon{
            top: 16px;
            right: 16px;
        }

        .overlay__statistic{
            left: 16px;
            right: 16px;
            width: auto;
            top: 102px;
        }
        .overlay__statistic--content{
            max-height: 40vh;
        }
    }   
</style>