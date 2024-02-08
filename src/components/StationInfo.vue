<template>
  <div class="rectangle-container">
     <button class="btn" @click="navigateToback">home</button>
    
     <div class="content">
       <h1>Charging Station Info</h1>
    <p>Simulation Time: {{ simTime }}</p>
    <p>Base Current Load: {{ baseCurrentLoad }}</p>
    <p>Battery Capacity: {{ batteryCapacity }}</p>
   </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      simTime: '',
      baseCurrentLoad: '',
      batteryCapacity: ''
    };
  },
  mounted() {
    this.fetchStationInfo();
  },
  methods: {
       navigateToback() {
    this.$router.push('/');
  },
    
    fetchStationInfo() {
      axios.get('http://127.0.0.1:5000/info')
        .then(response => {
          this.simTime = response.data.sim_time_hour + ':' + response.data.sim_time_min;
          this.baseCurrentLoad = response.data.base_current_load;
          this.batteryCapacity = response.data.battery_capacity_kWh;
        })
        .catch(error => {
          console.error('Error fetching station info:', error);
        });
    }
  }
}
</script>

<style scoped>
.rectangle-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  width: 80%; 
  height: 60vh; 
  border: 2px solid #000; 
  padding: 20px;
  background-color: bisque;
}
.content {
  font-size: 19px;
  color: rgb(4, 4, 4); 
  margin-top: 20px; 
  padding: 10px; 
  background-color: #f0f0f0; 
  border-radius: 5px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
}
.btn {
  position: absolute;
  top: 10px; 
  right: 10px; 
  color: #fff; 
  background-color: rgb(38, 165, 16); 
  border: none; 
  padding: 5px 10px; 
  border-radius: 6px; 
  width: 70px;
  height: 80px;
}
</style>

