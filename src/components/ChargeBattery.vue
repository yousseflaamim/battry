<template>
  <div>
    <h1>Charge Battery</h1>
    <button @click="startCharging">Start Charging</button>
    <button @click="stopCharging">Stop Charging</button>
    <p v-if="chargingStatus !== null">Charging Status: {{ chargingStatus }}</p>
    <p v-if="batteryPercentage !== null">Battery Percentage: {{ batteryPercentage }}%</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chargingStatus: null,
      batteryPercentage: null
    };
  },
  methods: {
    startCharging() {
      axios.post('http://127.0.0.1:5000/charge', { charging: 'on' })
        .then(response => {
          this.chargingStatus = response.data.charging;
        })
        .catch(error => {
          console.error('Error starting charging:', error);
        });
    },
    stopCharging() {
      axios.post('http://127.0.0.1:5000/charge', { charging: 'off' })
        .then(response => {
          this.chargingStatus = response.data.charging;
        })
        .catch(error => {
          console.error('Error stopping charging:', error);
        });
    },
    fetchBatteryPercentage() {
      axios.get('http://127.0.0.1:5000/charge')
        .then(response => {
          this.batteryPercentage = response.data;
        })
        .catch(error => {
          console.error('Error fetching battery percentage:', error);
        });
    }
  },
  mounted() {
    this.fetchBatteryPercentage();
  }
}
</script>
