<script>
	import Layer from "$lib/components/layer.svelte";
	import Image from "$lib/components/image.svelte";
</script>

<div id='float' class="flexible vertical medium-gap">
	<Layer />
	<Image />
</div>

<style>
	#float {
		position: absolute;
		background-color: transparent;
		z-index: 9999;
		margin-top: 2vh;
		margin-left: 2vh;
	}
</style>