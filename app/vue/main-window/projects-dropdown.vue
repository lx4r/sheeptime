<template>
    <select class="form-control" id="projectsDropdown">
        <option v-for="project in pl" v-bind:value="project[0]">
            {{project[1].name}}
        </option>
    </select>
</template>

<script>
    export default {
        props: ['pl'],
    }
</script>