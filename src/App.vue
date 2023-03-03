<template>
	<div id="app">
		<router-view/>
	</div>
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
</style>
