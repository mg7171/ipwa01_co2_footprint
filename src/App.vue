<template>
	<nav id="main">
		<div class="wrapper">
			<router-link to="/">
				<img src="@/assets/logo.svg" height="40" />
			</router-link>
		</div>
	</nav>
	<div class="main__wrapper">
        <nav id="secondary">
			<ul>
				<li>
					<router-link to="/">Home</router-link>
				</li>
				<li>
					<router-link to="/about">About</router-link>
				</li>
				<li>
					<router-link to="/imprint">Imprint</router-link>
				</li>
			</ul>
        </nav>
		<router-view/>
	</div>
	<footer>
		<div>
			<span>© {{ new Date().getFullYear() }} by Marco Gabriel.</span>&nbsp;<span>All rights reserved.</span><br/>
			<div class="current__emission">Since you've been on this page, the world has emitted about <i>{{ $store.state.emission.toLocaleString() }}</i> tons of CO2.</div>
		</div>
	</footer>
</template>

<script>
	export default {
		name: 'App',
		data() {
		},
		created() {
			//https://www.mcc-berlin.net/forschung/co2-budget.html#:~:text=Der%20j%C3%A4hrliche%20Aussto%C3%9F%20von%20CO,dies%201337%20Tonnen%20pro%20Sekunde.

			//Add 1377 to emission every second and update the value
			setInterval(() => {
				//23 / S
				this.$store.state.emission += 46;
			}, 50);
		}
  	}
</script>

<style lang="scss">
	@import "./scss/utilities/_variables.scss";

	body, html {
		height: 100%;
		margin: 0;
		padding: 0;
		font: $fo-default;
		min-width: 700px;
	}

	a{
		color: $co-main;
	}

	#app{
		height: 100%;

		.wrapper{
			max-width: 1040px;
			width: 100%;
			padding: 40px 20px;
			margin: 0 auto;
		}
	}

	nav#main{
		background-color: $co-white;
		padding: 9px 0;
		position: relative;

		.wrapper{
			max-width: 1040px;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
		}

		a{
			font-size: 0;
			line-height: 0;
		}
	}

	.main__wrapper{
		display: grid;
		grid-template-columns: min-content auto;
		height: calc(100% - 138px);
	}

	html[dir="rtl"] {
		.toggle__navigation,
		.toggle__sidebar,
		.toggle__graph,
		.country__name{
			left: auto;
			right: 140px;
		}

		#sidebar{
			border-left: none;

			.sidebar__header{
				padding: 10px 0 10px 20px;
			}
		}

		nav#secondary ul li a:after{
			margin-left: 0px;
			margin-right: 15px;
		}

		main#imprint,
		main#about{
			border-right: 2px solid #7CA5B8;
			border-left: none;
		}

		.column--right{
			text-align: left !important;
		}

		.country__name ul li:before{
			margin-left: 10px !important;
			margin-right: 0 !important;
		}
	}

	main#imprint,
	main#about{
		border-top: 2px solid #7CA5B8;
		border-bottom: 2px solid #7CA5B8;
		border-left: 2px solid #7CA5B8;
	}

	footer{
		background-color: $co-white;
		height: 80px;
		display: flex;	
		justify-content: center;
		align-items: center;

		> div{
			text-align: center;
		}

	.current__emission{
		background-color: #fff3cd;
		border: 1px solid #ffeeba;
		color: #856404;
		border-radius: 4px;
		padding: 5px 20px;
		margin-top: 5px;
	}
	}

	nav#secondary{
		ul{
			padding: 20px 0 0 0;
			margin: 0;

			li{
				list-style: none;
				
				a{
					text-decoration: none;
					color: $co-main;
					font-family: 'averta-extrabold', Arial;
					padding: 8px 0;
					margin: 0 20px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1px solid $co-main;

					&:after{
						content: "›";
						font-size: 24px;
						display: block;
						color: $co-main;
						margin-left: 15px;
					}
				}

				&:last-child a{
					border-bottom: none;
				}
			}
		}
	}
</style>
