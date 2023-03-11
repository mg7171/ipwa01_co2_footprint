<template>
	<nav id="main">
		<ul>
			<li><router-link to="/">Home</router-link></li>
			<li><router-link to="/about">About</router-link></li>
		</ul>
	</nav>
	<router-view/>
</template>

<script>
	export default {
		name: 'App'
  	}
</script>

<style lang="scss">
	@import "./scss/utilities/_variables.scss";

	body, html {
		height: 100%;
		margin: 0;
		padding: 0;
		font: $fo-default;
	}

	#app{
		height: 100%;
	}

	nav#main{
		background-color: $co-black;
		height: 48px;

		ul{
			list-style: none;
			margin: 0;
			padding: 0;

			li{
				display: inline-block;

				a{
					color: #FFFFFF;
					text-decoration: none;
				}				
			}
		}
	}
</style>
