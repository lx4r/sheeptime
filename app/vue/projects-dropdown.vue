<template>
    <select v-for="project in pl" class="form-control">
        <option value="{{project[0]}}">
            {{project[1].name}}
        </option>
    </select>
</template>

<script>
    export default {
        props: ['pl'],
    }
</script>