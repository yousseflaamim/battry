<template>
  <div>
    <h1>Base Load Information</h1>
    <ul>
      <li v-for="(load, hour) in baseLoads" :key="hour">
        {{ hour }}: {{ load }} kWh
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      baseLoads: {}
    };
  },
  mounted() {
    this.fetchBaseLoadInfo();
  },
  methods: {
    fetchBaseLoadInfo() {
      axios.get('http://127.0.0.1:5000/baseload')
        .then(response => {
          this.baseLoads = response.data;
        })
        .catch(error => {
          console.error('Error fetching base load info:', error);
        });
    }
  }
}
</script>
